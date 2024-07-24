"use client"

import React, { useContext } from 'react'
import NewsCardShare from '../NewsCard/NewsCardShare'
import { Container , Typography} from '@mui/material'
import styles from './Kerala.module.css'
import PageAd1 from '../Advertisements/PageAd1'
import MainNews from '../MainNews/MainNews'
import BasicBreadcrumbs from '../Breadcrumbs/PageBreadcrumbs'
import NewsCardScroll from '../NewsCard/NewsCardScroll'
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import NewsCard from '../NewsCard/NewsCard'
import NewsCardVertical from '../NewsCard/NewsCardVertical'
import NewsAd1 from '../Advertisements/NewsAd1'
import { NewsContext } from '@/contexts/NewsContext'
import Loader from '../Loader'

function capitalizeFirstLetter(string) {
  if (string){
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return ""
}

function Kerala({category}) {
      
  const capitalizedCategory =  capitalizeFirstLetter(category);

  const { contextLoading } = useContext(NewsContext);

  if (contextLoading) {
    return <div><Loader /></div>;
  }
  

  return (
    <div>
      <Container >
        <PageAd1 />
        <BasicBreadcrumbs category={category} />
        <div className={styles[`page-2`]}>
          
          <MainNews category={category} cardLimit={1} className={styles.main} />
          <NewsCard category={category} cardLimit={1} className={styles.newsCard} />

          <NewsCardVertical category={category} heading={`Recent in ${capitalizedCategory}`} cardLimit={4} startIndex={1} className={styles.share}/>

          <NewsAd1 className={styles.newsAd1}/>

          <NewsCardShare category={category} heading={`More in ${capitalizedCategory}`} cardLimit={16} startIndex={5} className={styles.more}/>

          <Typography className={styles.h1scroll} fontSize={20} fontWeight={600} color='primary.sub' sx={{ display: 'flex', justifyContent: 'flex-start', gap: '.7rem', alignSelf: 'flex-start', marginTop: '1.5rem' }}><ArrowCircleRightIcon />{`Latest from all categories`}
          </Typography>
          <NewsCardScroll startIndex={1} endIndex={30}  className={styles.newsScroll}/>
        </div>

      </Container>
    </div>
  )
}

export default Kerala