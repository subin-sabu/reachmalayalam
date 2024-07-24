"use client"

import React, { useContext } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Grid } from '@mui/material';
import { Box } from '@mui/system';
import Link from 'next/link';
import { NewsContext } from '../../contexts/NewsContext';
import { formatTimestamp } from '../../Utils/FormatTimestamp'




export default function MainNews({ startIndex, endIndex, className, cardLimit, category, tags,  heading, }) {

  // Use context to get the news array
  const {news, contextLoading} = useContext(NewsContext);

  // Filter newsArray based on category if category prop is received, otherwise use all of newsArray
  let filteredNews = category ? news.filter(news => news.category === category) : news;

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
    <Box className={className} sx={{
      marginTop: '0.5rem',
    }}>
      <Grid container
        rowSpacing={{ xs: 1 }}
        columnSpacing={{ xs: 1 }}
        justifyContent='center'
        height={`98%`}
      >

        {limitedNews.map((news, index) => {
          //can write code here if its specific to a document and needs data like 'news.timestamp'
          return (
            <Grid item key={index} xs={12} >
              <Link href={`/${news.category}/${news.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card sx={{ minWidth: 200, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <CardActionArea sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

                    <CardContent sx={{ display: 'flex', flexDirection: 'row', textAlign: 'center' }}>
                      <Typography variant="h6" fontWeight='600' component="div" fontSize={17} sx={{ wordBreak: 'break-word'}}>
                        {news.title}
                      </Typography>
                    </CardContent>
                    <CardMedia sx={{ width: '100%', maxWidth: '100%' }}
                      component="img"
                      height="200"
                      image={news.imageUrl || `/news alt images/news.jpg`}
                      alt="news image"
                    />
                    <CardContent sx={{ height: '80%', display: 'flex', flexDirection: 'column' }}>
                      <Typography gutterBottom variant="caption" color='text.secondary' component="div" sx={{display:{xs:'none', sm: 'block'}}} >
                        {formatTimestamp(news.timestamp)}
                      </Typography>

                      <Typography variant="body1" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: '4', WebkitBoxOrient: 'vertical', wordBreak: 'break-word' }}>
                        {news.description1}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Link>
            </Grid>
          )
        })}

      </Grid>

    </Box>

  );
}
