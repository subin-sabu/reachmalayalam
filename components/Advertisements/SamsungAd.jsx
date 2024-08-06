import React from 'react'
import { Link } from '@mui/material'
import Image from 'next/image'

//className prop helps apply custom css (eg. to hide in grid) when used in different pages. 
function HomeAd1({className}) {
  let Ad = '/Ad Images/kalari.jpg'

  return (
    
    <div className={className} style={{ marginTop: '1rem' , marginBottom:'0.5rem'}}>
      <Link target="_blank" rel="noopener noreferrer"  href="https://agasthyam.com/" alt='home ad1 link' style={{textDecoration:'none', color:'inherit'}}>
        <Image style={{ width: '100%' }}
          src={Ad} 
          alt="HomeAd1"
          width={970}
          height={90}
          
          layout='responsive'
          />
      </Link>

    </div>
    
  )
}

export default HomeAd1