"use client"

import React, { useEffect, useContext } from 'react';
import NewsElaborate from '../NewsElaborate/NewsElaborate';
import NewsAd1 from '../Advertisements/NewsAd1';
import {  Container, Typography, Button } from '@mui/material';
import NewsCardVertical from '../NewsCard/NewsCardVertical';
import { useRouter as useNavigate} from 'next/navigation'
import BasicBreadcrumbs from '../Breadcrumbs/Breadcrumbs';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import styles from './News.module.css';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import HomeAd16x9 from '../Advertisements/NewsAd16x9';
import NewsCardShare from '../NewsCard/NewsCardShare';
import NewsCardScroll from '../NewsCard/NewsCardScroll';
import NewsCardSmall from '../NewsCard/NewsCardSmall'
import NewsBullets from '../NewsBullets/NewsBullets';
import { NewsContext } from '@/contexts/NewsContext';
import Loader from '../Loader';
import RelatedNews from '../Tag Search/RelatedNews';



function capitalizeFirstLetter(string) {
  if (string){
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return ""
}

function News({category, id}) {
  // extract id and category from url
  
  const capitalizedCategory = capitalizeFirstLetter(category);
  const navigate = useNavigate();

  // scrolls to top of News Page when id changes
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [id]);

  //navigation for load more button
  function handleButtonClick(category) {
    // Navigate to the category page
    navigate(`/${category}`);

    // Jump to the top of the landing page without smooth scrolling
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  const { contextLoading } = useContext(NewsContext);

  if (contextLoading) {
    return <div><Loader /></div>;
  }


  return (
    <div>
      <Container>
        <NewsAd1 />
        <BasicBreadcrumbs category={category} id={id} />

        <div className={styles['page-2']}>

          <NewsElaborate category={category} id={id}  className={styles.headingKL} /> {/* pass id to NE */}
          <Button
            variant="contained"
            fullWidth='true'
            endIcon={<OpenInNewIcon />}
            sx={{ marginTop: '1rem' }}
            onClick={() => handleButtonClick(category)}
            className={styles.btn}
          >
            view more in {`${capitalizedCategory}`}
          </Button>

          <HomeAd16x9 className={styles.NewsAd1} />

          <RelatedNews 
          id={id} 
          heading={`Related Content`} 
          className = {styles.related} />

          <NewsCardSmall 
          startIndex={0}
          endIndex={6}
          category={category}
          heading={`Recent in ${capitalizedCategory}`}
          className={styles.small}/>

          <NewsCardVertical
            startIndex={0}
            endIndex={15}
            heading="Must Read"
            className={styles.p2kl}
          />

          <NewsCardShare  startIndex={0} cardLimit={14} heading={`Latest News`} className={styles.p2cardklsmall}/>
        
          <Typography className={styles.h1scroll} fontSize={20} fontWeight={600} color='primary.sub' sx={{ display: 'flex', justifyContent: 'flex-start', gap: '.7rem', alignSelf: 'flex-start', marginTop: '1.5rem' }}><ArrowCircleRightIcon />{`In News for a while now..`}
          </Typography>
          <NewsBullets className={styles.bullets} heading={`News Bullets`} cardLimit={10}/>
          <NewsCardScroll startIndex={15} endIndex={50}  className={styles.newsScroll}/>

        </div>
      </Container>
    </div>
  );
}

export default News;
