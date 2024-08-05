"use client"

import React, { useContext } from 'react';
import Link from 'next/link';
import styles from './NewsCardSmall.module.css'
import { NewsContext } from '../../contexts/NewsContext';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { Typography, Box, Card, CardContent, CardMedia } from '@mui/material';
import { formatTimestampFromMilliSeconds } from '../../Utils/FormatTimestamp';

function NewsCardVertical({ startIndex, endIndex, heading, className, category, cardLimit, negativeTags, omitLimit, data = [] , noTime }) {
  const { news, contextLoading } = useContext(NewsContext);

  // Ensure data is an array
  const newsData = Array.isArray(data) && data.length ? data : news ||[];

  // Filter news array based on category and negativeTags
  let filteredNews = category ? newsData.filter(news => news.category === category) : newsData;

  if (negativeTags && negativeTags.length > 0 && typeof omitLimit === 'number' && omitLimit >= 0) {
    let omittedCount = 0;
    filteredNews = filteredNews.filter(news => {
      if (Array.isArray(news.tags)) {
        if (negativeTags.every(negTag => news.tags.some(tag => tag.toLowerCase().includes(negTag.toLowerCase())))) {
          if (omittedCount < omitLimit) {
            omittedCount++;
            return false;
          }
        }
      }
      return true;
    });
  }

  // Slice the filtered news based on startIndex and endIndex if provided
  const slicedNews = filteredNews.slice(startIndex, endIndex || filteredNews.length);

  // Limit the number of cards based on cardLimit
  const limitedNews = slicedNews.slice(0, cardLimit);

  if (limitedNews.length === 0 && !contextLoading) {
    return (
      <Box className={className} mt={2} textAlign="center">
        <Typography>No news found{category ? ` in the category '${category}'` : ''} 😞</Typography>
      </Box>
    );
  }

  return (
    <Box className={className} mt={2} mb={2}>
      {heading && (
        <Typography gutterBottom variant="h1" color="primary.sub" sx={{ display: 'flex', alignItems: 'center', gap: '0.7rem', fontSize:'1.3rem', fontWeight:600 ,}}>
          <ArrowCircleRightIcon />
          {heading}
        </Typography>
      )}
      <Box>
        {limitedNews.map((news, index) => {
          const TimeAgo = formatTimestampFromMilliSeconds(news.timestamp);

          return (
            <Card key={index} sx={{ display: 'flex', mb: 2, maxWidth: 500, borderRadius: 2 }}>

              <Link href={`/${news.category}/${news.id}`} passHref style={{ textDecoration: 'none', color: 'inherit' }}>
                <Box sx={{ display: 'flex', width: '100%',  padding: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <Box sx={{ width: '15%' }} >
                    <CardMedia
                      component="img"
                      sx={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: 2, aspectRatio: '1/1' }}
                      image={news.thumbnailUrl || `/news alt images/news-small.jpg`}
                      alt="news"
                    />
                  </Box>
                  <Box sx={{
                    flex: 'row', paddingLeft: '10px', paddingRight: '6px', paddingTop: '5px', paddingBottom: '5px', width: '85%',
                  }}>
                    {/* <Typography variant="body2" color="textSecondary" padding={0}>
                    {TimeAgo}
                  </Typography> */}

                    <Typography variant="h2" sx={{ mt: 1, wordBreak: 'break-word', fontWeight: 600, padding: '0px', fontSize: '0.95rem' }} className={styles['title-line-clamp']}>

                      {news.title}

                    </Typography>

                  </Box>
                </Box>
              </Link>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}

export default NewsCardVertical;
