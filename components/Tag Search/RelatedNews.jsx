"use client"

import React, { useState, useContext, useEffect } from 'react';
import styles from './RelatedNews.module.css';
import Link from 'next/link';
import { NewsContext } from '../../contexts/NewsContext';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { Typography } from '@mui/material';
import { formatTimestamp } from '../../Utils/FormatTimestamp';
import Image from 'next/image';

function RelatedNews({ id, heading, className }) {
  const { news, contextLoading } = useContext(NewsContext);
  const [relatedNews, setRelatedNews] = useState([]);
  const [ripples, setRipples] = useState({});

  const addRipple = (index, event) => {
    const button = event.currentTarget.getBoundingClientRect();
    const size = Math.max(button.width, button.height);
    const x = event.clientX - button.left - size / 2;
    const y = event.clientY - button.top - size / 2;
    const newRipple = { x, y, size };

    setRipples({ ...ripples, [index]: newRipple });
  };

  const removeRipple = (index) => {
    setRipples(currentRipples => {
      const newRipples = { ...currentRipples };
      delete newRipples[index];
      return newRipples;
    });
  };

  useEffect(() => {
    if (!news || contextLoading) return;

    // Find the reference document using the provided id
    const referenceDoc = news.find(doc => doc.id === id);

    // If the reference document is not found or it has no tags, set relatedNews to an empty array
    if (!referenceDoc || !Array.isArray(referenceDoc.tags) || referenceDoc.tags.length === 0) {
      setRelatedNews([]);
      return;
    }

    // Filter out the "main" tag from the reference document's tags
    const referenceTags = referenceDoc.tags.filter(tag => tag.toLowerCase() !== 'main');

    // If there are no remaining tags after filtering, set relatedNews to an empty array
    if (referenceTags.length === 0) {
      setRelatedNews([]);
      return;
    }

    // Find all documents that have any of the tags from the reference document, excluding the reference document itself
    const relatedDocs = news.filter(doc => 
      doc.id !== id && Array.isArray(doc.tags) && doc.tags.some(tag => referenceTags.includes(tag))
    );

    // Remove duplicate documents based on their id
    const uniqueDocs = Array.from(new Set(relatedDocs.map(doc => doc.id)))
      .map(id => relatedDocs.find(doc => doc.id === id));

    // Sort the documents from latest to oldest based on the timestamp
    uniqueDocs.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);

    // Limit the results to the latest 6 documents
    setRelatedNews(uniqueDocs.slice(0, 6));
  }, [id, news, contextLoading]);

  // If there are no related news, return null and hide the component
  if (!relatedNews.length) {
    return <div style={{ display: 'block' }}></div>;
  }

  return (
    <div className={className}>
      <div className={styles['news-container']}>
        {heading && (
          <Typography gutterBottom fontSize={20} fontWeight={600} color='primary.sub' style={{ display: 'flex', justifyContent: 'flex-start', gap: '.7rem', alignSelf: 'flex-start' }}>
            <ArrowCircleRightIcon />
            {heading}
          </Typography>
        )}
        {relatedNews.map((news, index) => {
          const TimeAgo = formatTimestamp(news.timestamp);

          return (
            <div key={index} className={styles.card}>
              <Link href={`/${news.category}/${news.id}`} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                <div className={styles['news-card-content']}
                  onMouseDown={(event) => addRipple(index, event)}
                  onMouseUp={() => removeRipple(index)}>
                  {ripples[index] && (
                    <span
                      className={styles.ripple}
                      style={{
                        left: `${ripples[index].x}px`,
                        top: `${ripples[index].y}px`,
                        width: `${ripples[index].size}px`,
                        height: `${ripples[index].size}px`,
                        position: 'absolute',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        transform: 'scale(0)',
                        animation: 'ripple 0.6s linear',
                      }}
                    />
                  )}
                  <div className={styles['img-div']}>
                    <Image src={news.thumbnailUrl || `/news alt images/news-small.jpg`} alt="news" width={50} height={50} layout='responsive' loading='lazy' />
                  </div>
                  <div className={styles['news-content']}>
                    <p>{TimeAgo}</p>
                    <h5 style={{ wordBreak: 'break-word' }}>{news.title}</h5>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RelatedNews;
