// components/Pages/News.jsx

import React, { useEffect, useState } from 'react';
import NewsElaborate from '../NewsElaborate/NewsElaborate';
import NewsAd1 from '../Advertisements/NewsAd1';
import { Container, Typography, Button } from '@mui/material';
import { useRouter as useNavigate } from 'next/navigation';
import BasicBreadcrumbs from '../Breadcrumbs/Breadcrumbs';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import styles from './News.module.css';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import HomeAd16x9 from '../Advertisements/NewsAd16x9';
import NewsCardShare from '../NewsCard/NewsCardShare';
import NewsCardScroll from '../NewsCard/NewsCardScroll';
import NewsCardSmall from '../NewsCard/NewsCardSmall';
import NewsBullets from '../NewsBullets/NewsBullets';
import NewsCardVertical from '../NewsCard/NewsCardVertical';
import Loader from '../Loader';
import RelatedNews from '../Tag Search/RelatedNews';
import { fetchRelatedNews } from '@/lib/fetchRelatedNews';


function capitalizeFirstLetter(string) {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return '';
}

function News({ newsData, category }) {
  const capitalizedCategory = capitalizeFirstLetter(category);
  const navigate = useNavigate();

  const [relatedNews, setRelatedNews ]= useState([])
  useEffect(() => {
    if (newsData && newsData.tags) {
      fetchRelatedNews(newsData.tags, newsData.id, 6, 6)
        .then((data) => setRelatedNews(data))
        .catch((error) => console.error("Failed to fetch related news", error));
    }
  }, [newsData]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [newsData]);

  function handleButtonClick(category) {
    navigate(`/${category}`);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  if (!newsData) {
    return <div><Loader /></div>;
  }

  return (
    <div>
      <Container>
        <NewsAd1 />
        <BasicBreadcrumbs category={category} id={newsData.id} />
        <div className={styles['page-2']}>
          <NewsElaborate newsData={newsData} id={newsData.id} className={styles.headingKL} />
          <Button
            variant="contained"
            fullWidth
            endIcon={<OpenInNewIcon />}
            sx={{ marginTop: '1rem' }}
            onClick={() => handleButtonClick(category)}
            className={styles.btn}
          >
            view more in {`${capitalizedCategory}`}
          </Button>
          <HomeAd16x9 className={styles.NewsAd1} />
          <RelatedNews id={newsData.id} heading="Related Content" className={styles.related} />
          <NewsCardSmall startIndex={0} endIndex={6} category={category} heading={`Recent in ${capitalizedCategory}`} className={styles.small} />
          {relatedNews.length > 0 ? (
          <NewsCardVertical  heading="Must Read" className={styles.p2kl} data={relatedNews}/> ) : <p>Loading related news... </p>
        }
          
          
          
          <NewsCardShare startIndex={0} cardLimit={14} heading="Latest News" className={styles.p2cardklsmall} />
          <Typography className={styles.h1scroll} fontSize={20} fontWeight={600} color="primary.sub" sx={{ display: 'flex', justifyContent: 'flex-start', gap: '.7rem', alignSelf: 'flex-start', marginTop: '1.5rem' }}>
            <ArrowCircleRightIcon />{`In News for a while now..`}
          </Typography>
          <NewsBullets className={styles.bullets} heading="News Bullets" cardLimit={10} />
          <NewsCardScroll startIndex={15} endIndex={50} className={styles.newsScroll} />
        </div>
      </Container>
    </div>
  );
}

export default News;
