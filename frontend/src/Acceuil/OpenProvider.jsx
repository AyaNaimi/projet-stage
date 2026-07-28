import React, { createContext, useContext, useState, useEffect } from 'react';

// Créer un contexte pour l'état "open"
const OpenContext = createContext();

export const OpenProvider = ({ children }) => {
  const [open, setOpen] = useState(true);
  const [dynamicStyles, setDynamicStyles] = useState({
    position: 'fixed',
    top: '64px',
    // left: '20%',
    width: '100%',
    left: 0,
    right: 0,
    overflowY: 'auto',
    // height will be set dynamically on resize
    transition: 'all 0.2s ease',
  });

  // Fonction pour basculer l'état "open" et mettre à jour les styles
  const toggleOpen = () => {
    setOpen(prevOpen => !prevOpen);
  };

  useEffect(() => {
    const update = () => {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 600;
      const topValue = isMobile ? '56px' : '64px';
      setDynamicStyles(prevStyles => ({
        ...prevStyles,
        top: topValue,
        left: isMobile ? '0' : open ? '13.8%' : '4.5%',
        width: isMobile ? '100%' : open ? '86.2%' : '95.5%',
        height: `calc(100vh - ${topValue})`,
        overflowY: 'auto',
      }));
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [open]);

  return (
    <OpenContext.Provider value={{ dynamicStyles, open, toggleOpen }}>
      {children}
    </OpenContext.Provider> 
  );
};

// Hook personnalisé pour utiliser le contexte "open"
export const useOpen = () => useContext(OpenContext);
