import { useEffect, useState, type FC } from 'react';
import { X, Wifi, Check, Copy } from 'lucide-react';
import { getNetworkIpApi } from '../services/storage';

interface NetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NetworkModal: FC<NetworkModalProps> = ({ isOpen, onClose }) => {
  const [netInfo, setNetInfo] = useState<{ ip: string; port: number; url: string }>({
    ip: '192.168.1.187',
    port: 5173,
    url: 'http://192.168.1.187:5173'
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getNetworkIpApi().then(info => setNetInfo(info));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(netInfo.url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(netInfo.url)}&color=090a0f&bgcolor=ffffff`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div
        className="glass-panel glass-card-gold animate-fade-in"
        style={{
          maxWidth: '420px',
          width: '100%',
          padding: '24px',
          borderRadius: '24px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          textAlign: 'center'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(128,128,128,0.15)',
            border: 'none',
            color: 'var(--text-primary)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)' }}>
          <Wifi size={24} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Álbum Casamento no Telemóvel
          </h3>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
          Aponta a câmara de qualquer telemóvel ligado à mesma rede Wi-Fi para enviar fotografias para este computador:
        </p>

        {/* Imagem do QR Code Gerado */}
        <div style={{ background: '#fff', padding: '12px', borderRadius: '16px', boxShadow: 'var(--shadow-glow)' }}>
          <img src={qrImageUrl} alt="QR Code Álbum Casamento" style={{ width: '180px', height: '180px', display: 'block' }} />
        </div>

        {/* URL em texto e botão de copiar */}
        <div style={{ width: '100%', background: 'rgba(0,0,0,0.08)', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-gold)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {netInfo.url}
          </span>
          <button
            onClick={handleCopy}
            className="btn-glass"
            style={{
              padding: '6px 12px',
              fontSize: '0.75rem'
            }}
          >
            {copied ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>
        </div>

        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
          📁 Fotografias guardadas na pasta local <code>./uploads</code>.
        </p>

      </div>
    </div>
  );
};
