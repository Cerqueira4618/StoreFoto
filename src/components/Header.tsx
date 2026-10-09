import type { FC } from 'react';
import { QrCode, Sun, Moon } from 'lucide-react';
import { getEventDetails } from '../services/eventService';

interface HeaderProps {
  onOpenNetworkModal: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

/* ── Ícone SVG de ramo botânico inline ── */
const BotanicalBranch: FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 28 C16 28 16 6 16 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M16 20 C12 18 9 14 8 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    <path d="M8 10 C8 10 11 12 14 14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <path d="M16 14 C20 12 22 8 22 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    <path d="M22 5 C22 5 19 8 17 10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <path d="M16 8 C13 7 11 5 10 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" />
  </svg>
);

export const Header: FC<HeaderProps> = ({ onOpenNetworkModal, theme, onToggleTheme }) => {
  const eventDetails = getEventDetails();

  return (
    <header className="app-header">
      <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        
        {/* Marca & Nome do Casamento com estilo botânico */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            color: 'var(--accent-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <BotanicalBranch size={28} />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.15rem',
              fontWeight: 600,
              margin: 0,
              fontFamily: 'var(--font-heading)',
              color: 'var(--text-primary)',
              letterSpacing: '0.02em'
            }}>
              <span className="text-gold-gradient">{eventDetails.title}</span>
            </h1>
            <p style={{
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              margin: 0,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: 500
            }}>
              Partilha os teus momentos
            </p>
          </div>
        </div>

        {/* Botões de Ação: Alternar Tema & QR Code */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          
          {/* Seletor Claro / Escuro */}
          <button
            onClick={onToggleTheme}
            className="btn-glass"
            title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            style={{ padding: '8px 12px', fontSize: '0.78rem', borderRadius: '99px' }}
          >
            {theme === 'dark' ? (
              <>
                <Sun size={15} color="var(--accent-gold)" />
                <span style={{ fontSize: '0.75rem' }}>Claro</span>
              </>
            ) : (
              <>
                <Moon size={15} color="var(--accent-gold)" />
                <span style={{ fontSize: '0.75rem' }}>Escuro</span>
              </>
            )}
          </button>

          {/* Botão do QR Code da Rede/Evento */}
          <button
            onClick={onOpenNetworkModal}
            className="btn-glass"
            title="Ver QR Code do Casamento"
            style={{ padding: '8px 12px', fontSize: '0.78rem', borderRadius: '99px' }}
          >
            <QrCode size={16} color="var(--accent-gold)" />
          </button>

        </div>

      </div>
    </header>
  );
};
