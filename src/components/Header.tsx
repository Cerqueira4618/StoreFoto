import type { FC } from 'react';
import { QrCode, Sun, Moon } from 'lucide-react';
import { getEventDetails } from '../services/eventService';

interface HeaderProps {
  onOpenNetworkModal: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

/* ── Ramo de Oliveira discreto ── */
const OliveBranchIcon: FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 28 C16 28 16 6 16 4" stroke="#5E6E59" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M16 20 C12 18 9 14 8 10" stroke="#5E6E59" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    <path d="M8 10 C8 10 11 12 14 14" stroke="#5E6E59" strokeWidth="1" strokeLinecap="round" />
    <path d="M16 14 C20 12 22 8 22 5" stroke="#5E6E59" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    <path d="M22 5 C22 5 19 8 17 10" stroke="#5E6E59" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

export const Header: FC<HeaderProps> = ({ onOpenNetworkModal, theme, onToggleTheme }) => {
  const eventDetails = getEventDetails();

  return (
    <header className="app-header">
      <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        
        {/* Marca & Nome do Casamento */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <OliveBranchIcon size={24} />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.1rem',
              fontWeight: 500,
              margin: 0,
              fontFamily: 'var(--font-heading)',
              color: '#2C2C2C'
            }}>
              {eventDetails.title}
            </h1>
          </div>
        </div>

        {/* Botões de Ação: Alternar Tema & QR Code */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          
          {/* Seletor Claro / Escuro */}
          <button
            onClick={onToggleTheme}
            className="btn-glass"
            title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '99px' }}
          >
            {theme === 'dark' ? (
              <>
                <Sun size={14} color="#8DA286" />
                <span>Claro</span>
              </>
            ) : (
              <>
                <Moon size={14} color="#5E6E59" />
                <span>Escuro</span>
              </>
            )}
          </button>

          {/* Botão do QR Code da Rede/Evento */}
          <button
            onClick={onOpenNetworkModal}
            className="btn-glass"
            title="Ver QR Code do Casamento"
            style={{ padding: '6px 10px', borderRadius: '99px' }}
          >
            <QrCode size={15} color="#5E6E59" />
          </button>

        </div>

      </div>
    </header>
  );
};
