"use client"

import React, { useState, useContext } from 'react';
import styles from './NewsCardVertical.module.css';
import Link from 'next/link';
import { NewsContext } from '../../contexts/NewsContext';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { Typography } from '@mui/material';
import { formatTimestamp } from '../../Utils/FormatTimestamp'
import Image from 'next/image';



function NewsCardVertical({ startIndex, endIndex, heading, className, category, cardLimit, negativeTags, omitLimit }) {

  const [ripples, setRipples] = useState({});

  const addRipple = (index, event) => {
    const button = event.currentTarget.getBoundingClientRect();
    const size = Math.max(button.width, button.height);
    const x = event.clientX - button.left - size / 2;
    const y = event.clientY - button.top - size / 2;
    const newRipple = { x, y, size };

    // Update the ripples state with the new ripple
    setRipples({ ...ripples, [index]: newRipple });
  };

  const removeRipple = (index) => {
    setRipples(currentRipples => {
      const newRipples = { ...currentRipples };
      delete newRipples[index];
      return newRipples;
    });
  };

  // Use context to get the news array
  const {news, contextLoading} = useContext(NewsContext);

  // Filter newsArray based on category if category prop is received, otherwise use all of newsArray
  // Filter newsArray based on category if category prop is received, otherwise use all of newsArray
  let filteredNews = category ? news.filter(news => news.category === category) : news;

  // Exclude news items based on negativeTags
  if (negativeTags && negativeTags.length > 0 && typeof omitLimit === 'number' && omitLimit >= 0) {
    let omittedCount = 0; // Keep track of how many documents have been omitted
    filteredNews = filteredNews.filter(news => {
      // Check if news.tags is an array before using map function
      if (Array.isArray(news.tags)) {
        // Check if all elements of negativeTags are present in news.tags
        if (negativeTags.every(negTag => news.tags.some(tag => tag.toLowerCase().includes(negTag.toLowerCase())))) {
          // If the criteria are met, check if the omitLimit has been reached
          if (omittedCount < omitLimit) {
            omittedCount++; // Increment omittedCount
            return false; // Omit this document
          }
        }
      }
      return true; // Include the document in the filtered list
    });
  }


  // Slice the filtered news based on startIndex and endIndex if provided
  const slicedNews = filteredNews.slice(startIndex || 0, endIndex || filteredNews.length);

  // Limit the number of cards based on cardLimit
  const limitedNews = slicedNews.slice(0, cardLimit);

  // Check if there are news items in the category
  if (limitedNews.length === 0 && !contextLoading) {
    return (
      <div className="error-message">
        No news found{category ? ` in the category '${category}'` : ''} 😞
      </div>
    );
  }



  return (
    <div className={className}>
      <div className={styles['news-container']}>
        {heading && ( // Conditional rendering for heading
          <Typography gutterBottom fontSize={20} fontWeight={600} color='primary.sub' style={{ display: 'flex', justifyContent: 'flex-start', gap: '.7rem', alignSelf: 'flex-start' }}>
            <ArrowCircleRightIcon />
            {heading}
          </Typography>
        )}

        {limitedNews.map((news, index) => {

          //showing time as 'n mintes ago
          const TimeAgo = formatTimestamp(news.timestamp);

          return (
            <div key={index} className={styles.card}>
              <Link href={`/${news.category}/${news.id}`} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>

                <div className={styles['news-card-content']}
                  onMouseDown={(event) => addRipple(index, event)}
                  onMouseUp={() => removeRipple(index)}>
                  {/* Ripple Element */}
                  {ripples[index] && (
                    <span
                      className={styles.ripple}
                      style={{
                        left: `${ripples[index].x}px`,
                        top: `${ripples[index].y}px`,
                        width: `${ripples[index].size}px`,
                        height: `${ripples[index].size}px`,
                        position: 'absolute',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        transform: 'scale(0)',
                        animation: 'ripple 0.6s linear',
                      }}
                    />
                  )}
                  <div className={styles['img-div']}>
                    <Image src={news.thumbnailUrl || `/news alt images/news-small.jpg`} alt="news" layout='responsive' loading='lazy' width={80} height={80} />
                  </div>
                  <div className={styles['news-content']}>
                    <p >{TimeAgo}</p>
                    <h5 style={{wordBreak:'break-word'}}>{news.title}</h5>
                  </div>
                </div>
              </Link>
            </div>
          )
        })}
      </div>
    </div>

  );
}

export default NewsCardVertical;
