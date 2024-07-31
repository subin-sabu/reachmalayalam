// components/Pages/Home.jsx

import React, { useContext } from 'react';
import styles from "./Home.module.css"; // Import as a module
import HomeAd1 from '../Advertisements/HomeAd1';
import { Container, Typography, } from '@mui/material';
import MainNews from '../MainNews/MainNews';
import NewsCardVertical from '../NewsCard/NewsCardVertical';
import HomeAd16x9 from '../Advertisements/HomeAd16x9';
import NewsCard from '../NewsCard/NewsCard';
import HomeBreadcrumbs from '../Breadcrumbs/HomeBreadcrumb';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import NewsCardScroll from '../NewsCard/NewsCardScroll';
import NewsCardEdit from '../NewsCard/NewsCardEdit'
import NewsCardShare from '../NewsCard/NewsCardShare'
import SamsungAd from '../Advertisements/SamsungAd'
import NewsCardSmall from '../NewsCard/NewsCardSmall';
import NewsBullets from '../NewsBullets/NewsBullets';
import { NewsContext } from '@/contexts/NewsContext';
import Loader from '../Loader';

function Home({data}) {

  // console.log(`The data prop is ${ data[0].imageUrl}`)

  const { contextLoading } = useContext(NewsContext);

  if (contextLoading) {
    console.log('context is loading');
    // return <div><Loader /></div>;
  }

  return (
    <div>
      <Container>
        <HomeAd1 />
        <HomeBreadcrumbs />
        <div className={styles['grid-container']}>

          <NewsCardVertical cardLimit={6} heading='Latest News' className={styles.snippet1} negativeTags={['main']} omitLimit={1} data={data}/>
          <NewsCardSmall startIndex={0} endIndex={6} heading='Latest News' className={styles.snippet1small} negativeTags={['main']} omitLimit={1} />

          <MainNews className={styles.main} cardLimit={1} tags={['main']} data={data}/>
          <NewsCard className={styles.newsCard} cardLimit={1} imageType="image" tags={['main']} />

          <NewsCardVertical startIndex={7} endIndex={13} heading='Must Read' className={styles.snippet2} data={data} />

          <NewsCardShare className={styles.newsCardTab} startIndex={7} endIndex={13} heading={`Must Read`} />

          <NewsBullets className={styles.newsBullets} heading="News Bullets" cardLimit={10} />


          <HomeAd16x9 className={styles.ad2} />

          {/* heading of NewsCardScroll */}
          <Typography className={styles.heading} fontSize={20} fontWeight={600} color='primary.sub' sx={{ display: 'flex', justifyContent: 'flex-start', gap: '.7rem', alignSelf: 'flex-start', marginTop: '1.5rem' }}><ArrowCircleRightIcon />{`Never miss an update`}
          </Typography>
          <NewsCardScroll className={styles.scrollCard} startIndex={13} endIndex={23} />


        </div>

        {/* page 2 starts here*/}
        <div className={styles['page-2']}>
          <SamsungAd className={styles.NewsAd1} />
          <NewsBullets className={styles.newsBulletsP2} heading="News Bullets" cardLimit={10} />
          <NewsCardEdit className={styles.newsCardTabp2} startIndex={7} endIndex={15} heading={`In news for a while now`} />

          <Typography className={styles.headingKL} fontSize={20} fontWeight={600} color='primary.sub' sx={{ display: 'flex', justifyContent: 'flex-start', gap: '.7rem', alignSelf: 'flex-start', marginTop: '1.5rem' }}><ArrowCircleRightIcon />{`Kerala`}
          </Typography>
          <MainNews className={styles.p2kl} category={`kerala`} cardLimit={1} data={data}/>
          <NewsCardEdit className={styles.p2cardkl} category={`kerala`} startIndex={1} cardLimit={4} />
          <NewsCardShare className={styles.p2cardklsmall} category={`kerala`} startIndex={1} cardLimit={6} />
        </div>
      </Container>
    </div>
  );
}

export default Home;
