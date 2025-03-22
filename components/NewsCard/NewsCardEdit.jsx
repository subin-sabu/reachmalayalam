"use client"

import React, { useContext } from 'react';
import { NewsContext } from '../../contexts/NewsContext';
import { Card, CardContent, CardMedia, Typography, Grid, Box } from '@mui/material';
import styles from './NewsCardShare.module.css';
import Link from 'next/link';
import { formatTimestamp } from '../../Utils/FormatTimestamp';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import Image from 'next/image';


const NewsCardEdit = ({ category, cardLimit, startIndex, endIndex, className, heading }) => {
  // Accessing news context
  const {news, contextLoading} = useContext(NewsContext);

  // Filter news based on category if category prop is received, otherwise use all news
  const filteredNews = category ? news.filter(item => item.category === category) : news;

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
    <Box className={className}>
      <Box >
        {heading && ( // Conditional rendering for heading
          <Box>
            <Typography fontSize={20} fontWeight={600} color='primary.sub' sx={{ display: 'flex', justifyContent: 'flex-start', gap: '.7rem', alignSelf: 'flex-start', marginTop: '0.5rem' }}>
              <ArrowCircleRightIcon />
              {heading}
            </Typography>
          </Box>
        )}


        <Box sx={{display:'flex', flexFlow:'row wrap', justifyContent:'space-around', padding:'0.5rem' }}>
          {/* Map through filtered and limited news array */}
          {limitedNews.map((item, index) => {
            const TimeAgo = formatTimestamp(item.timestamp);
            return (
              <Box key={item.id}>
                <Link href={`/${item.category}/${item.id}`} style={{ textDecoration: 'none', color: 'inherit', display:'block', height:'100%' }}>
                  <Card sx={{ maxWidth: '220px', marginBottom:'10px', height:'95%'}}>
                    {/* Render news card content */}
                    <Box sx={{ width: '100%', position: 'relative', height: 120 }}> {/* Ensures image is responsive */}
                      <Image
                      src={item.thumbnailUrl || `/news alt images/news.jpg`}
                      alt={item.title || `news`}
                      fill
                      style={{ objectFit: 'cover' }} // Ensures the image covers the area without distortion
                      unoptimized={true}
                    />
                  </Box>
                    <CardContent>
                      <Typography variant='caption' component='div' gutterBottom sx={{display:{xs:'none', sm: 'block'}}}>
                        {TimeAgo}
                      </Typography>
                      <Typography gutterBottom variant="body2" component="div" fontWeight={600} className={styles['title-line-clamp']} sx={{ wordBreak: 'break-word'}}>
                        {item.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default NewsCardEdit;
