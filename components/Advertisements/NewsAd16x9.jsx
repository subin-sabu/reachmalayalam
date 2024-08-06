import React from 'react'
import { Link } from '@mui/material'
import Image from 'next/image'

function HomeAd16x9({className}) {
  let ad = '/Ad Images/UmeshCo.jpg'

  return (
    <div className={className}>
      <Link href='https://www.justdial.com/Kasaragod/Umesh-Kamath-Co-Near-Minarva-Theatre-Kanhangadaffic-Circle-Kanhangad/9999P4994-4994-140308113806-A5Y9_BZDET' alt='ad link' style={{textDecoration:'none', color:'inherit'}}>
        {/* Add 'aspectRatio:"16/9",' to img style to set aspect ratio  */}
      <Image style={{ maxWidth:'100%', marginTop:'1rem'}} 
      src={ad} 
      alt="home ad2 16*9"
      width={336}
      height={280}
      
      layout='responsive'
      />
      </Link>
    </div>
  )
}

export default HomeAd16x9