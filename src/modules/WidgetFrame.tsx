import { styled } from '@mui/material/styles';

export const Widget = styled('div')(({ theme }) => ({
        margin: 0,
        padding: 4,
        borderRadius: 8,
        maxWidth: '100%',
        position: 'relative',
        zIndex: 1,
        backgroundColor: 'rgba(230,230,230,0.8)',
        backdropFilter: 'blur(40px)',
  }));

