import React , { useContext }from 'react';
import styles from './NewsScroll.module.css';
import { NewsContext } from '../../contexts/NewsContext';
import  Box  from '@mui/material/Box';
import { BulletContext } from '../../contexts/BulletContext'


function NewsScroll() {
   
  const {news, contextLoading } = useContext(NewsContext);
  const scrollNews = news.slice(0,4)
  
  const bulletsArray = useContext(BulletContext);
  const scrollBullet = bulletsArray.slice(0,1)

  const scrollArray = [...scrollNews, ...scrollBullet, ...scrollNews, ...scrollBullet, ...scrollNews, ...scrollBullet,...scrollNews, ...scrollBullet, ...scrollNews, ...scrollBullet]

  return (
    <Box className={styles['scroll-container']}  >
      <div className={styles.scroll}>
        
        {scrollArray.map((newsItem, index) => (
          <span key={index}>{newsItem.title}</span>
        ))}
       
      </div>
    </Box>
  );
}

export default NewsScroll;
