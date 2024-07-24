'use client'

import React, { useState, useContext } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Link, Tooltip, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import styles from './NewsBullets.module.css';
// import AltImageSmall from '../Assets/News/news-small.jpg'
import { BulletContext } from '../../contexts/BulletContext';
import { formatTimestamp } from '../../Utils/FormatTimestamp'
import Image from 'next/image';

const NewsBullets = ({ className, heading, startIndex, endIndex, cardLimit }) => {

  const [expanded, setExpanded] = useState(null);

  //Use context to get the news bullets array
  const bulletsArray = useContext(BulletContext);

  // Slice the bulletsArray based on startIndex and endIndex if provided
  const slicedNews = bulletsArray.slice(startIndex || 0, endIndex || bulletsArray.length);

  // Limit the number of cards based on cardLimit
  const limitedNews = slicedNews.slice(0, cardLimit);

  // Check if there are news items in the category
  if (limitedNews.length === 0) {
    return (
      <div className="error-message">
        No headlines (or news bullets) found 😞
      </div>
    );
  }



  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  const handleMoreButton = (link) => {
    window.open(link, "_blank");
  }

  return (
    <div className={className} >
      {heading && ( // Conditional rendering for heading
        <Typography gutterBottom fontSize={20} fontWeight={600} color='primary.sub' style={{ display: 'flex', justifyContent: 'flex-start', gap: '.7rem', alignSelf: 'flex-start', paddingTop:'0.5rem' }}>
          <ArrowCircleRightIcon />
          {heading}
        </Typography>
      )}
      {limitedNews.map((news, index) => (
        <Accordion className={className} key={index} expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} title={news.title} sx={{ paddingLeft: '0.3rem', paddingRight: '0.1rem' }} >
            <div className={styles['img-div']}>
              <Image src={news.imageUrl || `/news alt images/news-small.jpg`} alt="news" width={80} height={80} layout='responsive' loading='lazy'/>
            </div>
            <div className={styles['news-content']}>
             <p style={{wordBreak:'break-word'}}>
             {news.title}
             </p>
            </div>

          </AccordionSummary>
          <AccordionDetails  style={{ maxWidth: '90vw' }} >
            <Typography sx={{ maxWidth: '100%', wordBreak:'break-word' }} >{news.description}</Typography>


            <Typography variant='caption'>{formatTimestamp(news.timestamp)}</Typography>
            {news.link &&
              <Button onClick={() => handleMoreButton(news.link)}>Click to read more</Button>}


          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default NewsBullets;
