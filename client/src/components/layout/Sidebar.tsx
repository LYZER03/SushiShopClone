import React, { ReactNode } from 'react';
import { Box, BoxProps } from '@chakra-ui/layout';

interface SidebarProps extends BoxProps {
  children: ReactNode;
}

/**
 * Composant Sidebar réutilisable pour le contenu de la barre latérale
 * 
 * Ce composant est destiné à être utilisé à l'intérieur du DashboardLayout
 * qui gère déjà la position fixe et le comportement de défilement.
 */
const Sidebar: React.FC<SidebarProps> = ({ children, ...rest }) => {
  return (
    <Box
      width="100%"
      height="100%"
      {...rest}
    >
      {children}
    </Box>
  );
};

export default Sidebar;
