import { useState, useEffect, type FC, type ChangeEvent, type FormEvent } from 'react';
import { Camera, Heart, Send, CheckCircle2 } from 'lucide-react';
import type { PhotoSubmission } from '../types/album';
import { fetchPhotosApi, uploadPhotoFileApi, likePhotoApi } from '../services/storage';

export const GuestView: FC = () => {
  const [photos, setPhotos] = useState<PhotoSubmission[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  // Imagens de teste rápido para desktop/simulação
  const sampleImages = [
    { label: '🥂 Brinde', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop' },
    { label: '💃 Festa', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop' },
    { label: '🎂 Bolo', url: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&auto=format&fit=crop' }
  ];

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    const list = await fetchPhotosApi();
    setPhotos(list);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !previewUrl) return;

    setIsUploading(true);
    try {
      const fallbackUrl = !selectedFile ? previewUrl : '';
      
      await uploadPhotoFileApi(
        selectedFile,
        'Convidado',
        't1',
        'Casamento',
        '',
        '',
        fallbackUrl
      );

      await loadPhotos();
      
      setIsUploading(false);
      setShowSuccessNotification(true);
      setSelectedFile(null);
      setPreviewUrl('');

      setTimeout(() => setShowSuccessNotification(false), 4000);
    } catch (error) {
      console.error('Erro ao enviar foto:', error);
      alert('Erro ao enviar a fotografia para o servidor.');
      setIsUploading(false);
    }
  };

  const handleLike = async (id: string) => {
    const updated = await likePhotoApi(id);
    setPhotos(updated);
  };

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Botão de Envio de Foto em Destaque Principal */}
      <div className="glass-panel glass-card-gold" style={{ padding: '24px 20px', borderRadius: '24px', textAlign: 'center' }}>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {previewUrl ? (
            /* Visualização da foto selecionada */
            <div style={{ position: 'relative', width: '100%', height: '300px', borderRadius: '20px', overflow: 'hidden', border: '3px solid var(--accent-gold)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
              <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button
                type="button"
                onClick={() => { setPreviewUrl(''); setSelectedFile(null); }}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(9, 10, 15, 0.85)',
                  color: '#fff',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '50%',
                  width: '38px',
                  height: '38px',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>
          ) : (
            /* Botão Principal de Câmara em Destaque Absoluto */
            <label
              style={{
                border: '3px dashed var(--accent-gold)',
                borderRadius: '24px',
                padding: '40px 20px',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, rgba(229, 193, 88, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '14px',
                touchAction: 'manipulation',
                boxShadow: 'var(--shadow-glow)',
                transition: 'all 0.3s ease'
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #e5c158 0%, #c2982d 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 30px rgba(229, 193, 88, 0.5)'
                }}
              >
                <Camera size={42} color="#090a0f" />
              </div>

              <div>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', display: 'block' }}>
                  Tirar Foto ou Escolher da Galeria
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
                  Toque para enviar instantaneamente
                </span>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>
          )}

          {/* Testes Rápidos sem Ficheiro */}
          {!previewUrl && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Foto Teste:</span>
              {sampleImages.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPreviewUrl(s.url)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '99px',
                    fontSize: '0.75rem',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid var(--border-glass)',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {/* Botão de Submissão em Destaque */}
          {previewUrl && (
            <button
              type="submit"
              disabled={isUploading}
              className="btn-gold"
              style={{ width: '100%', padding: '16px', fontSize: '1.1rem', borderRadius: '16px' }}
            >
              {isUploading ? (
                <span>A Guardar Foto...</span>
              ) : (
                <>
                  <Send size={20} />
                  <span>Enviar Foto Agora</span>
                </>
              )}
            </button>
          )}

        </form>
      </div>

      {/* Banner de Sucesso */}
      {showSuccessNotification && (
        <div
          className="glass-panel animate-fade-in"
          style={{
            padding: '16px 20px',
            borderRadius: '18px',
            border: '1px solid rgba(16, 185, 129, 0.5)',
            background: 'rgba(16, 185, 129, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <CheckCircle2 size={28} color="#34d399" />
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#fff' }}>
              Fotografia Enviada!
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              Guardada com sucesso no computador (<code>./uploads</code>).
            </p>
          </div>
        </div>
      )}

      {/* Feed Simples de Fotos Enviadas */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
            <span className="live-dot" />
            <span>Fotos do Casamento ({photos.length})</span>
          </h3>
          <button
            onClick={loadPhotos}
            style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
          >
            🔄 Atualizar
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {photos.length === 0 ? (
            <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              Ainda não há fotografias enviadas. Tira a primeira foto acima!
            </div>
          ) : (
            photos.map(photo => (
              <div
                key={photo.id}
                className="glass-panel"
                style={{ borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ position: 'relative', width: '100%', height: '300px', background: '#000' }}>
                  <img
                    src={photo.url}
                    alt="Foto de Casamento"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Enviada às {photo.timestamp}
                  </span>
                  <button
                    onClick={() => handleLike(photo.id)}
                    style={{
                      background: 'rgba(244, 63, 94, 0.15)',
                      border: '1px solid rgba(244, 63, 94, 0.35)',
                      color: '#f43f5e',
                      borderRadius: '99px',
                      padding: '6px 14px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Heart size={15} fill="#f43f5e" />
                    <span>{photo.likesCount || 0}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
