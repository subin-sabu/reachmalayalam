import React from 'react'
import { Link } from '@mui/material'
import Image from 'next/image'


//className prop helps apply custom css (eg. to hide in grid) when used in different pages. 
function HomeAd1({className}) {
  let altPath='/Ad Images/banner.gif'
  let imagePath = '/Ad Images/umesh banner.jpg'
  return (
    
    <div className={className} style={{ marginTop: '1rem' , marginBottom:'0.5rem'}}>
      <Link href="https://www.justdial.com/Kasaragod/Umesh-Kamath-Co-Near-Minarva-Theatre-Kanhangadaffic-Circle-Kanhangad/9999P4994-4994-140308113806-A5Y9_BZDET" target="_blank" rel="noopener noreferrer" alt='home ad1 link' style={{textDecoration:'none', color:'inherit'}}>
        <Image style={{  border: '1px solid lightgray'}}
          src={imagePath || altPath} 
          alt="HomeAd1"
          width={970}
          height={90}
          layout='responsive'
          loading='lazy'
        />
   
      </Link>

    </div>
    
  )
}

export default HomeAd1