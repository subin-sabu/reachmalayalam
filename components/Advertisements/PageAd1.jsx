
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'


function NewsAd1() {
let Ad = '/Ad Images/banner.gif'
  return (
    <div style={{marginTop:'1rem', marginBottom:'1rem'}}>
      <Link href="/kerala/2024-04-20T17:10:20.307Z" alt='ad banner category page' style={{ textDecoration: 'none', color: 'inherit' }}>
        <Image style={{ display: 'flex', width: '100%', marginTop: '1rem' }}
        src={Ad} 
        alt="reach promo"
        width={970}
        height={90}
        
        layout='responsive'
         />
      </Link>

    </div>
  )
}

export default NewsAd1