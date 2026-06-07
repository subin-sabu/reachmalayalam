import React, { useContext } from 'react';
import styles from './NewsScroll.module.css';
import { NewsContext } from '../../contexts/NewsContext';
import Box from '@mui/material/Box';
import { BulletContext } from '../../contexts/BulletContext'


function dynamicIO(input, target) {
  if (!input.length) return [];
  if (target <= 0) return [];
  // Make copies of array items to have target number of items finally.
  return Array.from({ length: target }, (_, i) => input[i % input.length]);
}
 

function NewsScroll() {

  const { news, contextLoading } = useContext(NewsContext);
  const regex = /^\s*scroll\s*$/i; // Regular expression to match 'scroll' in a case-insensitive manner
  const scrollNews = news.slice(0, 5).filter(item => Array.isArray(item.tags) && item.tags.some(tag => regex.test(tag)));
  // Filering news items that have 'Scroll' tag and taking only the latest 3 news items. This is to ensure that the news scroll is not overloaded with too many items and also to maintain the relevance of the news being displayed in the scroll.

  
  const bulletsArray = useContext(BulletContext);
  const scrollBullet = bulletsArray.slice(0, 0);

  const sourceArray = [...scrollNews, ...scrollBullet];

  const placeholder = [{ title: "For the latest news analysis and updates, follow us..." }, {title: "Send your articles to reachmalayalam@gmail.com"}];
  
  const scrollArray = contextLoading ? [] :dynamicIO(sourceArray.length ? sourceArray : placeholder, 28);

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
