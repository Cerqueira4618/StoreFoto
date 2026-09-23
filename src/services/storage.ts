import type { PhotoSubmission } from '../types/album';
import { getCurrentEventSlug } from './eventService';

// URL do Worker Cloudflare (pode ser configurada no .env ou fica com fallback para a API local)
const R2_WORKER_BASE_URL = import.meta.env.VITE_R2_WORKER_URL || '';

export async function fetchPhotosApi(): Promise<PhotoSubmission[]> {
  const eventSlug = getCurrentEventSlug();
  const endpoint = R2_WORKER_BASE_URL 
    ? `${R2_WORKER_BASE_URL}/api/photos?evento=${eventSlug}`
    : `/api/photos?evento=${eventSlug}`;

  try {
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error('Falha ao obter fotos do servidor.');
    const photos = await res.json();
    return photos;
  } catch (err) {
    console.warn(`[Storage] A carregar fotos locais do evento (${eventSlug}):`, err);
    const storageKey = `storefoto_photos_${eventSlug}`;
    const local = localStorage.getItem(storageKey);
    return local ? JSON.parse(local) : [];
  }
}

export async function uploadPhotoFileApi(
  file: File | null,
  guestName: string,
  tableId: string,
  tableName: string,
  caption: string,
  message: string,
  fallbackPresetUrl?: string
): Promise<PhotoSubmission> {
  const eventSlug = getCurrentEventSlug();
  const endpoint = R2_WORKER_BASE_URL 
    ? `${R2_WORKER_BASE_URL}/api/upload?evento=${eventSlug}`
    : `/api/upload?evento=${eventSlug}`;

  const formData = new FormData();
  if (file) {
    formData.append('photo', file);
  } else if (fallbackPresetUrl) {
    formData.append('photoUrl', fallbackPresetUrl);
  }
  
  formData.append('guestName', guestName || 'Convidado');
  formData.append('tableId', tableId || 't1');
  formData.append('tableName', tableName || 'Casamento');
  formData.append('caption', caption || '');
  formData.append('message', message || '');
  formData.append('evento', eventSlug);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      throw new Error('Erro na resposta do servidor.');
    }

    const result = await res.json();
    return result.photo;
  } catch (err) {
    console.warn('[Storage] Fallback para guardado local em IndexedDB/LocalStorage:', err);
    
    // Guardar offline/localmente por evento
    const storageKey = `storefoto_photos_${eventSlug}`;
    const localData = localStorage.getItem(storageKey);
    const photos: PhotoSubmission[] = localData ? JSON.parse(localData) : [];

    const newPhoto: PhotoSubmission = {
      id: `photo_${Date.now()}`,
      url: fallbackPresetUrl || (file ? URL.createObjectURL(file) : ''),
      guestName: guestName || 'Convidado',
      tableId: tableId || 't1',
      tableName: tableName || 'Casamento',
      timestamp: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
      status: 'LIVE_APPROVED',
      caption: caption || '',
      messageToCouples: message || '',
      likesCount: 0
    };

    photos.unshift(newPhoto);
    localStorage.setItem(storageKey, JSON.stringify(photos));
    return newPhoto;
  }
}

export async function likePhotoApi(photoId: string): Promise<PhotoSubmission[]> {
  const eventSlug = getCurrentEventSlug();
  const endpoint = R2_WORKER_BASE_URL 
    ? `${R2_WORKER_BASE_URL}/api/photos/${photoId}/like?evento=${eventSlug}`
    : `/api/photos/${photoId}/like?evento=${eventSlug}`;

  try {
    const res = await fetch(endpoint, { method: 'POST' });
    const data = await res.json();
    return data.photos || fetchPhotosApi();
  } catch {
    return fetchPhotosApi();
  }
}

export async function getNetworkIpApi(): Promise<{ ip: string; port: number; url: string }> {
  const eventSlug = getCurrentEventSlug();
  try {
    const res = await fetch('/api/network-ip');
    if (res.ok) {
      const data = await res.json();
      return { ...data, url: `${data.url}?evento=${eventSlug}` };
    }
  } catch {}
  return {
    ip: window.location.hostname,
    port: 5173,
    url: `${window.location.protocol}//${window.location.host}?evento=${eventSlug}`
  };
}
