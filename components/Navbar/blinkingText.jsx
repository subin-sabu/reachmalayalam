import React from 'react';
import Typography from '@mui/material/Typography';
import { keyframes } from '@mui/system';

const blinkAnimation = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const BlinkingText = ({ text }) => {
  return (
    <Typography
      variant="body1"
      color="warning.main"
      fontWeight={800}
      sx={{
        animation: `${blinkAnimation} 2s linear infinite`,
        display: 'inline-block',
      }}
    >
      {text}
    </Typography>
  );
};

export default BlinkingText;
