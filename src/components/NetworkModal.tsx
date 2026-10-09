import { useState, type FC } from 'react';
import { X, Check, Copy, QrCode } from 'lucide-react';

interface NetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NetworkModal: FC<NetworkModalProps> = ({ isOpen, onClose }) => {

  const [activeTestSlug, setActiveTestSlug] = useState('pedro-e-sofia');
  const [copied, setCopied] = useState(false);

  const testEvents = [
    { label: '💍 Pedro & Sofia', slug: 'pedro-e-sofia' },
    { label: '🥂 Ana & João', slug: 'ana-e-joao' },
    { label: '✨ Maria & Tiago', slug: 'maria-e-tiago' }
  ];

  if (!isOpen) return null;

  const currentUrl = `https://Cerqueira4618.github.io/StoreFoto/?evento=${activeTestSlug}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(currentUrl)}&color=3C4637&bgcolor=ffffff`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(42, 40, 36, 0.6)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div
        className="glass-panel animate-fade-in"
        style={{
          maxWidth: '420px',
          width: '100%',
          padding: '28px 24px',
          borderRadius: '24px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '18px',
          textAlign: 'center',
          border: '1px solid var(--border-gold)'
        }}
      >
        {/* Botão fechar */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(107, 123, 94, 0.08)',
            border: 'none',
            color: 'var(--text-secondary)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <X size={16} />
        </button>

        {/* Título */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <QrCode size={22} color="var(--accent-gold)" style={{ marginBottom: '4px' }} />
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            margin: 0,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-heading)'
          }}>
            QR Code do Casamento
          </h3>
          <p style={{
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            margin: 0,
            lineHeight: 1.5
          }}>
            Seleciona um casamento de teste:
          </p>
        </div>

        {/* Chips de Seleção de Casamento */}
        <div style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          maxWidth: '100%',
          paddingBottom: '4px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {testEvents.map(evt => (
            <button
              key={evt.slug}
              onClick={() => setActiveTestSlug(evt.slug)}
              style={{
                padding: '7px 14px',
                borderRadius: '99px',
                fontSize: '0.78rem',
                fontWeight: 600,
                border: activeTestSlug === evt.slug
                  ? '1.5px solid var(--accent-gold)'
                  : '1px solid var(--border-glass)',
                background: activeTestSlug === evt.slug
                  ? 'var(--accent-gold)'
                  : 'rgba(107, 123, 94, 0.04)',
                color: activeTestSlug === evt.slug
                  ? '#FFFFFF'
                  : 'var(--text-primary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              {evt.label}
            </button>
          ))}
        </div>

        {/* QR Code Gerado */}
        <div style={{
          background: '#FFFFFF',
          padding: '16px',
          borderRadius: '18px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          border: '1px solid rgba(107, 123, 94, 0.1)'
        }}>
          <img
            src={qrImageUrl}
            alt="QR Code de Teste"
            style={{ width: '180px', height: '180px', display: 'block' }}
          />
        </div>

        {/* Botão de abrir este casamento no navegador */}
        <a
          href={currentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold"
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '0.88rem',
            borderRadius: '14px',
            textDecoration: 'none',
            fontWeight: 600
          }}
        >
          <span>Abrir Casamento de Teste →</span>
        </a>

        {/* URL em texto e copiar */}
        <div style={{
          width: '100%',
          background: 'rgba(107, 123, 94, 0.04)',
          padding: '10px 14px',
          borderRadius: '12px',
          border: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px'
        }}>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {currentUrl}
          </span>
          <button
            onClick={handleCopy}
            className="btn-glass"
            style={{ padding: '4px 10px', fontSize: '0.72rem', flexShrink: 0 }}
          >
            {copied ? <Check size={14} color="var(--success-text)" /> : <Copy size={14} />}
            <span>{copied ? 'Copiado' : 'Copiar'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
