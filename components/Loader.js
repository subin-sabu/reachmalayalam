import React from 'react'
import Image from 'next/image'
import { CircularProgress, Typography } from '@mui/material'


function Loader() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#181818', zIndex: 9999, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Image src='/logo512.png' alt="Loading..." width={200} height={200} style={{ width: '200px', height: 'auto' }} />
      <CircularProgress style={{ marginTop: '20px' }} />
      <Typography variant="body1" style={{ marginTop: '10px', color: 'white' }}>Setting up the best experience for you...</Typography>
    </div>
  )
}

export default Loader











