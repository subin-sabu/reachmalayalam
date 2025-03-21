// components/NewsCard/NewsCardVertical.jsx

"use client"

import React, { useContext } from 'react';
import Link from 'next/link';
import styles from './NewsCardVertical.module.css'
import { NewsContext } from '../../contexts/NewsContext';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { Typography, Box, Card } from '@mui/material';
import Image from 'next/image';
import { formatTimestampFromMilliSeconds } from '../../Utils/FormatTimestamp';

function NewsCardVertical({ startIndex, endIndex, heading, className, category, cardLimit, negativeTags, omitLimit, data = [], noTime }) {
  const { news, contextLoading } = useContext(NewsContext);

  // Ensure data is an array
  const newsData = Array.isArray(data) && data.length ? data : news || [];

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
        <Typography gutterBottom variant="h2" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: '0.7rem', fontSize:'1.3rem', fontWeight: 600, }}>
          <ArrowCircleRightIcon />
          {heading}
        </Typography>
      )}
      <Box>
        {limitedNews.map((news, index) => {
          const TimeAgo = formatTimestampFromMilliSeconds(news.timestamp);

          return (
            <Card key={index} sx={{ display: 'flex', mb: 2, maxWidth: 500, borderRadius: 2 }}>
              <Link href={`/${news.category}/${news.id}`} passHref style={{ textDecoration: 'none', color: 'inherit', width:'100%' }}>
                <Box sx={{ display: 'flex', width: '100%', textDecoration: 'none', color: 'inherit', padding: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <Box sx={{ width: '25%', position: 'relative', height: 0, paddingBottom: '25%' }}>
                    <Image
                      src={news.thumbnailUrl || `/news alt images/news-small.jpg`}
                      alt="news"
                      fill
                      style={{ borderRadius: '8px', objectFit:'cover' }}
                      unoptimized={true}
                    />
                  </Box>
                  <Box sx={{
                    flex: 'row', paddingLeft: '10px', paddingRight: '6px', paddingTop: '5px', paddingBottom: '5px', width: '75%',
                  }}>
                    {/* <Typography variant="body2" color="textSecondary" padding={0} sx={noTime && { display: 'none' }} >
                      {TimeAgo}
                    </Typography> */}

                    <Typography variant="body" sx={{ mt: 1, wordBreak: 'break-word', fontWeight: 600, padding: '0px' }} className={styles['title-line-clamp']}>
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
