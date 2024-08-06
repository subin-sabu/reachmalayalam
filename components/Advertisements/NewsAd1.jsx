import React from 'react'
import { Link, useMediaQuery } from '@mui/material'
import Image from 'next/image';



//className prop helps apply custom css (eg. to hide in grid) when used in different pages. 
function NewsAd1({className}) {
  const isMdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));
  let altAd = '/Ad Images/banner.gif'
  let Ad = '/Ad Images/ayurveda.jpg'
  
  return (
    
    <div className={className} style={{ marginTop: '1rem' , marginBottom:'0.5rem', display:'flex' , justifyContent:'center'}}>
      <Link  target="_blank" rel="noopener noreferrer" alt='news ad1 link' style={{textDecoration:'none', color:'inherit'}}>
        <Image  style={{
            width: isMdUp ? '50vw' : '100%', // Set width to 60vw on md and up screens, and 100% on xs and sm screens
            maxWidth: '100%',
          }}
          src={Ad || altAd} 
          alt="NewsAd1" 
          width={970}
          height={90}
          layout='responsive'
          
          />
      </Link>

    </div>
    
  )
}

export default NewsAd1