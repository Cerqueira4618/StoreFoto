import { useState, useEffect, type FC, type ChangeEvent, type FormEvent } from 'react';
import { Camera, Heart, Send, CheckCircle2 } from 'lucide-react';
import type { PhotoSubmission } from '../types/album';
import { fetchPhotosApi, uploadPhotoFileApi, likePhotoApi } from '../services/storage';

/* ── Ícone SVG de ramo decorativo ── */
const LeafDecor: FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
    <path d="M30 55 C30 55 30 10 30 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M30 40 C24 37 18 30 16 22" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <path d="M16 22 C18 22 22 26 26 30" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
    <path d="M30 28 C36 25 40 18 41 12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <path d="M41 12 C39 14 35 20 32 24" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
    <path d="M30 18 C26 16 23 12 22 7" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
    <path d="M30 45 C34 43 37 39 38 34" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
  </svg>
);

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
      alert('Erro ao enviar a fotografia.');
      setIsUploading(false);
    }
  };

  const handleLike = async (id: string) => {
    const updated = await likePhotoApi(id);
    setPhotos(updated);
  };

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* ═══ Secção Principal de Upload ═══ */}
      <div
        className="glass-panel"
        style={{
          padding: '28px 24px',
          borderRadius: '24px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decoração botânica de canto */}
        <LeafDecor style={{
          position: 'absolute',
          top: '-6px',
          right: '12px',
          color: 'var(--accent-gold)',
          opacity: 0.15,
          transform: 'rotate(15deg)'
        }} />
        <LeafDecor style={{
          position: 'absolute',
          bottom: '-8px',
          left: '8px',
          color: 'var(--accent-gold)',
          opacity: 0.1,
          transform: 'rotate(-165deg) scaleX(-1)'
        }} />

        {/* Ícone e título da secção */}
        <div style={{ marginBottom: '16px', position: 'relative', zIndex: 1 }}>
          <div style={{ 
            color: 'var(--accent-gold)', 
            marginBottom: '10px',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <LeafDecor style={{ width: '40px', height: '40px' }} />
          </div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            fontFamily: 'var(--font-heading)',
            color: 'var(--text-primary)',
            margin: 0,
            lineHeight: 1.3
          }}>
            Partilha os teus<br />momentos
          </h2>
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            marginTop: '8px',
            lineHeight: 1.5
          }}>
            Seleciona as fotos que tiraste durante o casamento.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', zIndex: 1 }}>
          
          {previewUrl ? (
            /* Visualização da foto selecionada */
            <div style={{
              position: 'relative',
              width: '100%',
              height: '300px',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '2px solid var(--border-gold)',
              boxShadow: 'var(--shadow-card)'
            }}>
              <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button
                type="button"
                onClick={() => { setPreviewUrl(''); setSelectedFile(null); }}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(8px)'
                }}
              >
                ✕
              </button>
            </div>
          ) : (
            /* Botão Principal de Selecionar Fotografias */
            <label
              style={{
                border: '2px dashed var(--border-gold)',
                borderRadius: '20px',
                padding: '36px 20px',
                cursor: 'pointer',
                background: 'rgba(107, 123, 94, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                touchAction: 'manipulation',
                transition: 'all 0.3s ease'
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'rgba(107, 123, 94, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Camera size={28} color="var(--accent-gold)" strokeWidth={1.5} />
              </div>

              <div>
                <span style={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  display: 'block'
                }}>
                  Selecionar fotografias
                </span>
                <span style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  marginTop: '4px',
                  display: 'block'
                }}>
                  ou arrasta aqui
                </span>
                <span style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  marginTop: '6px',
                  display: 'block',
                  opacity: 0.7
                }}>
                  JPG, PNG, HEIC • Máx. 50 MB por foto
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
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Teste:</span>
              {sampleImages.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPreviewUrl(s.url)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '99px',
                    fontSize: '0.72rem',
                    background: 'rgba(107, 123, 94, 0.06)',
                    border: '1px solid var(--border-glass)',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {/* Botão de Submissão */}
          {previewUrl && (
            <button
              type="submit"
              disabled={isUploading}
              className="btn-gold"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '0.95rem',
                borderRadius: '14px',
                fontWeight: 600,
                letterSpacing: '0.01em'
              }}
            >
              {isUploading ? (
                <span>A enviar a foto...</span>
              ) : (
                <>
                  <Send size={18} />
                  <span>Enviar fotos</span>
                </>
              )}
            </button>
          )}

        </form>
      </div>

      {/* ═══ Banner de Notificação de Sucesso ═══ */}
      {showSuccessNotification && (
        <div
          className="glass-panel animate-fade-in"
          style={{
            padding: '20px 24px',
            borderRadius: '20px',
            border: '1px solid var(--success-border)',
            background: 'var(--success-bg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            textAlign: 'center'
          }}
        >
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(107, 123, 94, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CheckCircle2 size={28} color="var(--success-text)" />
          </div>
          <div>
            <h4 style={{
              fontSize: '1.15rem',
              fontWeight: 600,
              margin: 0,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-heading)'
            }}>
              Fotos enviadas com sucesso!
            </h4>
            <p style={{
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
              margin: '6px 0 0 0',
              lineHeight: 1.5
            }}>
              Upload para o Álbum completo.
            </p>
          </div>
          <button
            onClick={() => setShowSuccessNotification(false)}
            className="btn-glass"
            style={{
              padding: '10px 20px',
              fontSize: '0.85rem',
              borderRadius: '12px',
              marginTop: '4px'
            }}
          >
            <Camera size={16} />
            <span>Enviar mais fotos</span>
          </button>
        </div>
      )}

      {/* ═══ Feed de Fotos Enviadas ═══ */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h3 style={{
            fontSize: '1.05rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-heading)'
          }}>
            <span className="live-dot" />
            <span>Fotos do Casamento ({photos.length})</span>
          </h3>
          <button
            onClick={loadPhotos}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-gold)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.02em'
            }}
          >
            Atualizar →
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {photos.length === 0 ? (
            <div
              className="glass-panel"
              style={{
                padding: '40px 20px',
                textAlign: 'center',
                color: 'var(--text-secondary)',
                borderRadius: '20px'
              }}
            >
              <div style={{ color: 'var(--accent-gold)', opacity: 0.3, marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
                <Camera size={36} strokeWidth={1} />
              </div>
              <p style={{ fontSize: '0.9rem', fontFamily: 'var(--font-heading)', fontWeight: 500 }}>
                Ainda não há fotografias
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Tira a primeira foto acima!
              </p>
            </div>
          ) : (
            photos.map(photo => (
              <div
                key={photo.id}
                className="glass-panel"
                style={{ borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ position: 'relative', width: '100%', height: '300px', background: 'var(--bg-dark)' }}>
                  <img
                    src={photo.url}
                    alt="Foto de Casamento"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div style={{
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Enviada às {photo.timestamp}
                  </span>
                  <button
                    onClick={() => handleLike(photo.id)}
                    style={{
                      background: 'rgba(193, 108, 112, 0.08)',
                      border: '1px solid rgba(193, 108, 112, 0.2)',
                      color: '#C16C70',
                      borderRadius: '99px',
                      padding: '6px 14px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Heart size={15} fill="#C16C70" />
                    <span>{photo.likesCount || 0}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ═══ Link para galeria ═══ */}
      {photos.length > 0 && (
        <div style={{ textAlign: 'center', padding: '8px 0 20px' }}>
          <button
            onClick={loadPhotos}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer',
              letterSpacing: '0.02em'
            }}
          >
            Ver galeria →
          </button>
        </div>
      )}

    </div>
  );
};
