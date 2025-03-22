// components/LoadingSpinner.js
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const LoadingSpinner = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'start',
        height: '100vh',
        marginTop:'15vh',
        marginBottom:'50vh',
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingSpinner;
