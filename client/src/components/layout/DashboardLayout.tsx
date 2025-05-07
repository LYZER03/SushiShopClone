import React, { ReactNode, useEffect, useState } from 'react';
import { Box, Flex } from '@chakra-ui/layout';

interface DashboardLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
}

/**
 * DashboardLayout - Structure de type admin panel avec sidebar fixe
 * 
 * Ce layout utilise Flexbox pour diviser l'écran en deux zones principales:
 * 1. Sidebar (fixe à gauche)
 * 2. Main (contenu principal scrollable)
 * 
 * Le header et footer sont gérés par l'AppLayout parent
 */
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  sidebar 
}) => {
  // État pour stocker les styles dynamiques du sidebar
  const [sidebarStyles, setSidebarStyles] = useState({
    position: 'fixed',
    top: '70px',
    bottom: '80px', // Valeur par défaut
    left: 0,
    width: '250px',
  });
  
  useEffect(() => {
    // Fonction pour détecter la position du footer et ajuster le sidebar
    const adjustSidebarToFooter = () => {
      const footer = document.querySelector('footer');
      if (!footer) return;
      
      // Fonction pour vérifier si le footer est visible
      const checkFooterVisibility = () => {
        const footerRect = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Si le haut du footer est visible dans la fenêtre
        if (footerRect.top < windowHeight) {
          // Calculer la distance entre le haut du footer et le bas de la fenêtre
          const distanceFromBottom = windowHeight - footerRect.top;
          
          // Appliquer un padding pour éviter le footer, avec une marge de sécurité
          const safeDistance = distanceFromBottom + 10; // 10px de marge de sécurité
          
          // Mettre à jour les styles du sidebar pour qu'il s'arrête BIEN au-dessus du footer
          setSidebarStyles(prev => {
            // Ne mettre à jour que si la différence est significative pour éviter le flickering
            if (Math.abs(parseInt(prev.bottom) - safeDistance) > 2) {
              return {
                ...prev,
                bottom: `${safeDistance}px`,
                // Désactiver toute transition pour éviter l'effet d'animation
                transition: 'none'
              };
            }
            return prev; // Pas de changement si minime (réduit les re-renders)
          });
        } else {
          // Rétablir la position par défaut quand le footer n'est pas visible
          setSidebarStyles(prev => ({
            ...prev,
            bottom: '80px', // Valeur par défaut
            transition: 'none' // Désactiver toute transition
          }));
        }
      };
      
      // Vérifier immédiatement et à chaque scroll
      checkFooterVisibility();
      window.addEventListener('scroll', checkFooterVisibility);
      window.addEventListener('resize', checkFooterVisibility);
      
      return () => {
        window.removeEventListener('scroll', checkFooterVisibility);
        window.removeEventListener('resize', checkFooterVisibility);
      };
    };
    
    // Attendre un peu pour s'assurer que tout est rendu
    const timer = setTimeout(adjustSidebarToFooter, 500);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);
  
  return (
    <Flex maxW="100%" position="relative">
      {/* Sidebar - Colonne gauche qui s'arrête au footer */}
      <Box
        display={{ base: "none", md: "block" }}
        position={sidebarStyles.position as any}
        top={sidebarStyles.top}
        bottom={sidebarStyles.bottom}
        left={sidebarStyles.left}
        width={sidebarStyles.width}
        py={4}
        px={5}
        overflowY="auto"
        backgroundColor="white"
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'var(--chakra-colors-gray-300)',
            borderRadius: '24px',
          },
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--chakra-colors-gray-300) transparent',
        }}
      >
        {sidebar}
      </Box>

      {/* Main Content - Zone principale scrollable */}
      <Box
        flex="1"
        ml={{ base: 0, md: "250px" }}
        p={{ base: 4, md: 8 }}
      >
        {children}
      </Box>
    </Flex>
  );
};

export default DashboardLayout;
