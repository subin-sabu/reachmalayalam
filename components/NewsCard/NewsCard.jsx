"use client"

import React, { useContext } from 'react';
import { NewsContext } from '../../contexts/NewsContext';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Grid } from '@mui/material';
import { Box } from '@mui/system';
import { useTheme } from '@emotion/react';
import Link from 'next/link'
import styles from './NewsCard.module.css'
import { formatTimestamp, formatTimestampFromMilliSeconds } from '../../Utils/FormatTimestamp'
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import Image from 'next/image';





export default function NewsCard({ startIndex, endIndex, className, imageType, cardLimit, category, tags, heading, data }) {
  const theme = useTheme();

  //Use context to get the news array
  const { contextLoading } = useContext(NewsContext);

  const news = data;
  const newsArray = news;

  // Filter newsArray based on category if category prop is received, otherwise use all of newsArray
  let filteredNews = category ? newsArray.filter(news => news.category === category) : newsArray;

  // Filter news based on tags if tags prop is received
  if (tags && tags.length > 0) {
    filteredNews = filteredNews.filter(news => {
      if (Array.isArray(news.tags)) {
        return tags.every(tag => news.tags.some(newsTag => newsTag.toLowerCase() === tag.toLowerCase()));
      } else {
        return false; // Skip news items without tags
      }
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
    <Box className={className} >
      <Grid container
        rowSpacing={{ xs: 1, sm: 2, md: 3, lg: 4 }}
        columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 4 }}
        justifyContent='center'
      >

        {heading && ( // Conditional rendering for heading
          <Grid item xs={12}>
            <Typography fontSize={20} fontWeight={600} color='primary.sub' sx={{ display: 'flex', justifyContent: 'flex-start', gap: '.7rem', alignSelf: 'flex-start', marginTop: '0.5rem' }}>
              <ArrowCircleRightIcon />
              {heading}
            </Typography>
          </Grid>
        )}


        {limitedNews.map((news, index) => {
          // Decide the image URL based on the `imageType` prop for each news item
          const imageUrl = news[imageType === 'image' ? 'imageUrl' : 'thumbnailUrl'];

          return (

            <Grid item xs={12} key={index} style={{ display: 'flex', justifyContent: 'space-around' }} >
              <Link href={`/${news.category}/${news.id}`} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                <Card sx={{
                  maxWidth: 500,
                  // [theme.breakpoints.up('sm')]: { maxWidth: 220 },
                  height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                }}>
                  <CardActionArea sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box sx={{ width: '100%', position: 'relative', height: { xs: 160, md: 200 } }}> {/* Ensures image is responsive */}

                      <Image
                        src={news.imageUrl || `/news alt images/news.jpg`}
                        alt="news image"
                        fill
                        style={{ objectFit: 'cover' }} // Ensures the image covers the area without distortion
                        sizes="(max-width: 500px) 500px, 820px" // Adjust as per your layout
                        priority // Optional: Makes sure important images are loaded first
                      />
                    </Box>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Typography gutterBottom variant="caption" color='text.secondary' component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {formatTimestampFromMilliSeconds(news.timestamp)}
                      </Typography>

                      <Typography className={styles['title-line-clamp']} gutterBottom variant="h1" component="div" sx={{ mb: 1, fontWeight: '600', wordBreak: 'break-word', fontSize: '1rem' }}>
                        {news.title}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Link>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

