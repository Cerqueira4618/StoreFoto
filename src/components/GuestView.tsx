import { useState, useEffect, type FC, type ChangeEvent, type FormEvent } from 'react';
import { Heart, Check, ImagePlus, Camera, ArrowRight } from 'lucide-react';
import type { PhotoSubmission } from '../types/album';
import { fetchPhotosApi, uploadPhotoFileApi, likePhotoApi } from '../services/storage';

/* ── Desenho de Ramo de Oliveira Minimalista Line-Art ── */
const OliveBranchSketch: FC<{ size?: number; color?: string; style?: React.CSSProperties }> = ({
  size = 64,
  color = 'var(--accent-gold)',
  style
}) => (
  <svg width={size} height={size} viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
    <path d="M40 90 C40 60 42 30 38 10" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    <path d="M39 75 C30 72 22 62 18 50 C24 53 34 60 39 70" stroke={color} strokeWidth="1" strokeLinejoin="round" />
    <path d="M39 55 C28 50 18 38 15 24 C22 28 32 37 38 48" stroke={color} strokeWidth="1" strokeLinejoin="round" />
    <path d="M39 35 C30 28 22 18 20 6 C26 12 34 22 38 30" stroke={color} strokeWidth="1" strokeLinejoin="round" />
    <path d="M40 68 C50 63 58 52 62 40 C56 45 46 54 40 62" stroke={color} strokeWidth="1" strokeLinejoin="round" />
    <path d="M39 48 C50 42 60 30 63 16 C57 22 47 33 40 42" stroke={color} strokeWidth="1" strokeLinejoin="round" />
    <path d="M38 28 C46 20 54 12 55 2 C50 8 43 18 38 24" stroke={color} strokeWidth="1" strokeLinejoin="round" />
  </svg>
);

export const GuestView: FC = () => {
  const [photos, setPhotos] = useState<PhotoSubmission[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

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
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '16px 20px 40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* ═══ ECRÃ DE SUCESSO ═══ */}
      {showSuccessNotification ? (
        <div
          className="glass-panel animate-fade-in"
          style={{
            padding: '48px 24px 36px',
            borderRadius: '24px',
            background: 'var(--bg-card)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '20px',
            border: '1px solid var(--border-glass)',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          {/* Círculo verde claro com o checkmark */}
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'var(--success-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Check size={36} color="var(--accent-gold)" strokeWidth={2.2} />
            </div>

            <div style={{ position: 'absolute', top: '-10px', left: '-12px', fontSize: '12px', opacity: 0.5 }}>✦</div>
            <div style={{ position: 'absolute', top: '4px', right: '-14px', fontSize: '10px', opacity: 0.5 }}>•</div>
            <div style={{ position: 'absolute', bottom: '-6px', left: '2px', fontSize: '10px', opacity: 0.5 }}>•</div>
            <div style={{ position: 'absolute', bottom: '10px', right: '-10px', fontSize: '12px', opacity: 0.5 }}>✦</div>
          </div>

          <div>
            <h2 style={{
              fontSize: '1.6rem',
              fontWeight: 500,
              fontFamily: 'var(--font-heading)',
              color: 'var(--text-primary)',
              margin: 0,
              lineHeight: 1.3
            }}>
              Fotos enviadas<br />com sucesso!
            </h2>
            <p style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              margin: '12px 0 0 0',
              lineHeight: 1.5,
              fontWeight: 400
            }}>
              Obrigado por partilhares estes momentos connosco.
            </p>
          </div>

          <button
            onClick={() => setShowSuccessNotification(false)}
            className="btn-glass"
            style={{
              width: '100%',
              maxWidth: '280px',
              padding: '14px 20px',
              fontSize: '0.9rem',
              borderRadius: '99px',
              marginTop: '8px'
            }}
          >
            <Camera size={18} color="var(--accent-gold)" />
            <span>Enviar mais fotos</span>
          </button>

          <div style={{ marginTop: '16px', opacity: 0.8 }}>
            <OliveBranchSketch size={54} color="var(--accent-gold)" />
          </div>

          <button
            onClick={() => {
              setShowSuccessNotification(false);
              const el = document.getElementById('gallery-feed');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-gold)',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '4px'
            }}
          >
            <span>Ver galeria</span>
            <ArrowRight size={16} />
          </button>
        </div>
      ) : (

        /* ═══ FORMULÁRIO PRINCIPAL DE UPLOAD ═══ */
        <div
          className="glass-panel"
          style={{
            padding: '36px 24px 28px',
            borderRadius: '24px',
            background: 'var(--bg-card)',
            textAlign: 'center',
            border: '1px solid var(--border-glass)',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          {/* Ramo de Oliveira Line-Art no topo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <OliveBranchSketch size={68} color="var(--accent-gold)" />
          </div>

          {/* Título e descrição */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: 500,
              fontFamily: 'var(--font-heading)',
              color: 'var(--text-primary)',
              margin: 0,
              lineHeight: 1.25
            }}>
              Partilha os teus<br />momentos
            </h2>
            <p style={{
              fontSize: '0.88rem',
              color: 'var(--text-secondary)',
              marginTop: '10px',
              lineHeight: 1.5,
              fontWeight: 400
            }}>
              Seleciona as fotos que tiraste durante o casamento.<br />Podes enviar várias de uma vez.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {previewUrl ? (
              /* Visualização da foto selecionada */
              <div style={{
                position: 'relative',
                width: '100%',
                height: '280px',
                borderRadius: '18px',
                overflow: 'hidden',
                border: '1px solid var(--border-gold)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
              }}>
                <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  type="button"
                  onClick={() => { setPreviewUrl(''); setSelectedFile(null); }}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '50%',
                    width: '34px',
                    height: '34px',
                    fontSize: '1rem',
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
              /* Caixa de Seleção com Borda Tracejada e Ícone de Foto + Plus */
              <label
                style={{
                  border: '1.5px dashed var(--border-gold)',
                  borderRadius: '18px',
                  padding: '40px 20px',
                  cursor: 'pointer',
                  background: 'rgba(94, 110, 89, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ color: 'var(--accent-gold)', marginBottom: '2px' }}>
                  <ImagePlus size={44} strokeWidth={1.2} />
                </div>

                <div>
                  <span style={{
                    fontSize: '1.05rem',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    display: 'block',
                    fontFamily: 'var(--font-body)'
                  }}>
                    Selecionar fotografias
                  </span>
                  <span style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-secondary)',
                    marginTop: '4px',
                    display: 'block'
                  }}>
                    ou arrasta aqui
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    marginTop: '8px',
                    display: 'block'
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '2px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Fotos teste:</span>
                {sampleImages.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPreviewUrl(s.url)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '99px',
                      fontSize: '0.72rem',
                      background: 'rgba(94, 110, 89, 0.08)',
                      border: '1px solid var(--border-glass)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer'
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}

            {/* Botão de Submissão Verde Oliva Sólido */}
            <button
              type="submit"
              disabled={isUploading || (!selectedFile && !previewUrl)}
              className="btn-gold"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '1rem',
                borderRadius: '12px',
                fontWeight: 500,
                opacity: (!selectedFile && !previewUrl) && !isUploading ? 0.65 : 1,
                cursor: (!selectedFile && !previewUrl) && !isUploading ? 'not-allowed' : 'pointer'
              }}
            >
              {isUploading ? (
                <span>A enviar as fotografias...</span>
              ) : (
                <span>Enviar fotos</span>
              )}
            </button>

          </form>
        </div>
      )}

      {/* ═══ FEED / GALERIA DE FOTOS ═══ */}
      <div id="gallery-feed" style={{ marginTop: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h3 style={{
            fontSize: '1.2rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-heading)'
          }}>
            <span className="live-dot" />
            <span>Galeria do Casamento ({photos.length})</span>
          </h3>
          <button
            onClick={loadPhotos}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-gold)',
              fontSize: '0.82rem',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Atualizar →
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {photos.length === 0 ? (
            <div
              className="glass-panel"
              style={{
                padding: '36px 20px',
                textAlign: 'center',
                color: 'var(--text-secondary)',
                borderRadius: '20px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-glass)'
              }}
            >
              <div style={{ color: 'var(--accent-gold)', opacity: 0.5, marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                <Camera size={32} strokeWidth={1.2} />
              </div>
              <p style={{ fontSize: '0.95rem', fontFamily: 'var(--font-heading)', fontWeight: 500, color: 'var(--text-primary)' }}>
                Ainda não há fotografias
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Tira a primeira foto acima para partilhar!
              </p>
            </div>
          ) : (
            photos.map(photo => (
              <div
                key={photo.id}
                className="glass-panel"
                style={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-glass)'
                }}
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
                      background: 'rgba(217, 83, 79, 0.08)',
                      border: '1px solid rgba(217, 83, 79, 0.2)',
                      color: '#D9534F',
                      borderRadius: '99px',
                      padding: '6px 14px',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Heart size={15} fill="#D9534F" color="#D9534F" />
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
