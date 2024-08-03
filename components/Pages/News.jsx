//components/Pages/News.jsx

import React, { useEffect, useState, useRef } from 'react';
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

  const [relatedNews, setRelatedNews] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (newsData && newsData.tags) {
      // Set up timer to track time spent on the component
      timerRef.current = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000); // Increment time spent every second

      return () => {
        clearInterval(timerRef.current);
        timerRef.current = null;
      };
    }
  }, [newsData]);

  useEffect(() => {
    // time spent in seconds
    if (timeSpent >= 1 && newsData && newsData.tags && !isFetching) {
      setIsFetching(true);

      // arguments: tags, id, resultsPerTag, tagLimit, newsLimit
      fetchRelatedNews(newsData.tags, newsData.id, 4, 5, 10)
        .then((data) => setRelatedNews(data))
        .catch((error) => console.error("Failed to fetch related news", error))
        .finally(() => setIsFetching(false));
    }
  }, [timeSpent, newsData, isFetching]);

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
          {relatedNews.length > 0 ? (
            <RelatedNews heading="Related Content" className={styles.related} data={relatedNews} />
          ) : (
            <p>{isFetching ? 'Fetching related news...' : 'Loading related news...'}</p>
          )}

          <NewsCardSmall startIndex={0} endIndex={6} category={category} heading={`Recent in ${capitalizedCategory}`} className={styles.small}  />
          
          <NewsCardVertical
            startIndex={0}
            endIndex={15}
            heading="Must Read"
            className={styles.p2kl}
            noTime={true}
          />

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
