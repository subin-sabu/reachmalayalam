// components/MainNews/MainNews.jsx

"use client"

import React, { useContext } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Image from 'next/image'; // Import next/image
import Typography from '@mui/material/Typography';
import { CardActionArea, Grid } from '@mui/material';
import { Box } from '@mui/system';
import Link from 'next/link';
import { NewsContext } from '../../contexts/NewsContext';
import { formatTimestampFromMilliSeconds } from '../../Utils/FormatTimestamp';

export default function MainNews({ startIndex, endIndex, className, cardLimit, category, tags, heading, data }) {

  const { contextLoading } = useContext(NewsContext);
  const news = data;

  
  // Filter newsArray based on category if category prop is received, otherwise use all of newsArray
  let filteredNews = category ? news.filter(news => news.category === category) : news;

  if (tags && tags.length > 0) {
    filteredNews = filteredNews.filter(news => {
      if (Array.isArray(news.tags)) {
        return tags.every(tag => news.tags.some(newsTag => newsTag.toLowerCase() === tag.toLowerCase()));
      } else {
        return false;
      }
    });
  }

  // Slice the filtered news based on startIndex and endIndex if provided
  const slicedNews = filteredNews.slice(startIndex || 0, endIndex || filteredNews.length);

  // Limit the number of cards based on cardLimit
  const limitedNews = slicedNews.slice(0, cardLimit);

  if (limitedNews.length === 0 && !contextLoading) {
    return (
      <div className="error-message">
        No news found{category ? ` in the category '${category}'` : ''} 😞
      </div>
    );
  }

  return (
    <Box className={className} sx={{ marginTop: '0.5rem' }}>
      <Grid container
        rowSpacing={{ xs: 1 }}
        columnSpacing={{ xs: 1 }}
        justifyContent='center'
        height={`98%`}
      >
        {limitedNews.map((news, index) => (
          <Grid item key={index} xs={12}>
            <Link href={`/${news.category}/${news.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Card sx={{ minWidth: 200, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardActionArea sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

                  <CardContent sx={{ display: 'flex', flexDirection: 'row', textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight='600' component="div" fontSize={17} sx={{ wordBreak: 'break-word' }}>
                      {news.title}
                    </Typography>
                  </CardContent>

                  <Box sx={{ width: '100%', position: 'relative', height: { xs: 150, md: 200 } }}> {/* Ensures image is responsive */}
                    <Image
                      src={news.imageUrl || `/news alt images/news.jpg`}
                      alt="news image"
                      fill
                      style={{objectFit:'cover'}} // Ensures the image covers the area without distortion
                      sizes="(max-width: 500px) 500px, 820px" // Adjust as per your layout
                      priority // Optional: Makes sure important images are loaded first
                    />
                  </Box>

                  <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography gutterBottom variant="caption" color='text.secondary' component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
                      {formatTimestampFromMilliSeconds(news.timestamp)}
                    </Typography>

                    <Typography variant="body1" sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: '4',
                      WebkitBoxOrient: 'vertical',
                      wordBreak: 'break-word'
                    }}>
                      {news.description1}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
