import type { FC } from 'react';
import { Sparkles, QrCode, Sun, Moon } from 'lucide-react';
import { getEventDetails } from '../services/eventService';

interface HeaderProps {
  onOpenNetworkModal: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: FC<HeaderProps> = ({ onOpenNetworkModal, theme, onToggleTheme }) => {
  const eventDetails = getEventDetails();

  return (
    <header className="app-header">
      <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        
        {/* Marca & Nome do Casamento Ativo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #e5c158 0%, #c2982d 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(229, 193, 88, 0.4)',
            flexShrink: 0
          }}>
            <Sparkles size={20} color="#090a0f" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
              <span className="text-gold-gradient">{eventDetails.title}</span>
            </h1>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0 }}>
              Recordações em Tempo Real
            </p>
          </div>
        </div>

        {/* Botões de Ação: Alternar Tema & QR Code */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          
          {/* Seletor Claro / Escuro */}
          <button
            onClick={onToggleTheme}
            className="btn-glass"
            title={theme === 'dark' ? 'Mudar para Branco & Dourado' : 'Mudar para Preto & Dourado'}
            style={{ padding: '8px 12px', fontSize: '0.78rem', borderRadius: '99px' }}
          >
            {theme === 'dark' ? (
              <>
                <Sun size={15} color="#e5c158" />
                <span style={{ fontSize: '0.75rem' }}>Claro</span>
              </>
            ) : (
              <>
                <Moon size={15} color="#b8932c" />
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
