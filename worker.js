/**
 * CLOUDFLARE WORKER PARA CLOUDFLARE R2 BUCKET
 * 
 * Este ficheiro pode ser colado diretamente no painel do Cloudflare Workers
 * (100.000 pedidos/dia grátis) ligado ao teu Bucket R2 (10 GB grátis).
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Resposta a pedidos OPTIONS (CORS Preflight)
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const eventSlug = url.searchParams.get('evento') || 'demo-casamento';
    const photosKey = `events/${eventSlug}/photos.json`;

    try {
      // 1. ROTA GET: Obter fotos do casamento
      if (request.method === 'GET' && url.pathname === '/api/photos') {
        const object = await env.BUCKET.get(photosKey);
        if (!object) {
          return new Response(JSON.stringify([]), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        const data = await object.text();
        return new Response(data, {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // 2. ROTA POST: Upload de foto para o R2 Bucket
      if (request.method === 'POST' && url.pathname === '/api/upload') {
        const formData = await request.formData();
        const file = formData.get('photo');
        const guestName = formData.get('guestName') || 'Convidado';
        const photoUrlFallback = formData.get('photoUrl');

        let publicPhotoUrl = '';

        if (file && typeof file === 'object') {
          const timestamp = Date.now();
          const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
          const fileKey = `events/${eventSlug}/photos/${timestamp}_${cleanFileName}`;

          // Guardar ficheiro de imagem no Cloudflare R2
          await env.BUCKET.put(fileKey, file.stream(), {
            httpMetadata: { contentType: file.type || 'image/jpeg' }
          });

          // URL público da imagem (através do Worker ou domínio R2)
          publicPhotoUrl = `${url.origin}/raw/${fileKey}`;
        } else if (photoUrlFallback) {
          publicPhotoUrl = photoUrlFallback.toString();
        } else {
          return new Response(JSON.stringify({ error: 'Nenhuma imagem enviada' }), {
            status: 400,
            headers: corsHeaders
          });
        }

        // Ler lista de fotos existente
        let photos = [];
        const existingObj = await env.BUCKET.get(photosKey);
        if (existingObj) {
          try { photos = JSON.parse(await existingObj.text()); } catch {}
        }

        const newPhoto = {
          id: `photo_${Date.now()}`,
          url: publicPhotoUrl,
          guestName: guestName.toString().trim(),
          tableName: 'Casamento',
          timestamp: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toISOString(),
          status: 'LIVE_APPROVED',
          likesCount: 0
        };

        photos.unshift(newPhoto);

        // Atualizar ficheiro JSON de metadados no R2
        await env.BUCKET.put(photosKey, JSON.stringify(photos, null, 2), {
          httpMetadata: { contentType: 'application/json' }
        });

        return new Response(JSON.stringify({ success: true, photo: newPhoto }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // 3. ROTA GET: Servir ficheiro direto da imagem do R2
      if (request.method === 'GET' && url.pathname.startsWith('/raw/')) {
        const rawKey = url.pathname.replace('/raw/', '');
        const imageObj = await env.BUCKET.get(rawKey);
        if (!imageObj) {
          return new Response('Imagem não encontrada', { status: 404 });
        }
        const headers = new Headers();
        imageObj.writeHttpMetadata(headers);
        headers.set('Access-Control-Allow-Origin', '*');
        return new Response(imageObj.body, { headers });
      }

      return new Response(JSON.stringify({ message: 'API R2 Álbum Casamento' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
