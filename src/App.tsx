import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { GuestView } from './components/GuestView';
import { NetworkModal } from './components/NetworkModal';

export function App() {
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);
  
  // Gestão do tema ('dark' = Preto & Dourado, 'light' = Branco & Dourado)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('album_casamento_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('album_casamento_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="app-container">
      {/* Cabeçalho com o nome Álbum Casamento e alternador de tema */}
      <Header
        onOpenNetworkModal={() => setIsNetworkModalOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Vista Exclusiva do Convidado */}
      <main style={{ flex: 1, paddingBottom: '40px' }}>
        <GuestView />
      </main>

      {/* Modal de Ligação Wi-Fi com QR Code */}
      <NetworkModal
        isOpen={isNetworkModalOpen}
        onClose={() => setIsNetworkModalOpen(false)}
      />
    </div>
  );
}

export default App;
