import React, { useState, useEffect } from 'react';

const InstagramPlayer = ({ instagramUrl }) => {
  const [embedUrl, setEmbedUrl] = useState('');

  useEffect(() => {
    // Extracting the video ID from the Instagram URL
    const videoId = extractVideoId(instagramUrl);
    // Constructing the embed URL
    setEmbedUrl(`https://www.instagram.com/p/${videoId}/embed/`);
  }, [instagramUrl]);

  // Function to extract video ID from Instagram URL
  const extractVideoId = (url) => {
    const match = url.match(/\/(?:p|reel)\/([\w-]+)\/?/);
    return match ? match[1] : '';
  };

  const iframeStyle = {
    width: '100%',
    height: '100%',
    border: 'none', // Remove iframe border
    backgroundColor: 'transparent', // Set iframe background color to transparent
  };

  return (
    <iframe
      title="Instagram video player"
      src={embedUrl}
      style={iframeStyle}
      width="100%"
      height="100%"
      ></iframe>
  );
};

export default InstagramPlayer;
