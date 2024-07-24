import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

function HomeAd16x9({className}) {
  let imagePath = '/Ad Images/ReachAd16x9.jpg'
  return (
    <div className={className}>
      <Link href='/kerala/2024-04-20T17:10:20.307Z' alt='ad link' style={{textDecoration:'none', color:'inherit'}}>
        {/* Add 'aspectRatio:"16/9",' to img style to set aspect ratio  */}
      <Image style={{ maxWidth:'100%', marginTop:'1rem'}} 
      src={imagePath} 
      alt="home ad2 16*9"
      width={336} 
      height={280}
      loading='lazy'
      layout='responsive'
      />
      </Link>
    </div>
  )
}

export default HomeAd16x9