import React, { useState, useEffect } from 'react';

const YoutubePlayer = ({ youtubeUrl }) => {
  const [videoId, setVideoId] = useState('');

  useEffect(() => {
    try {
      const id = youtubeUrl.match(
        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|watch\?v=|v\/|watch\?.+&v=))([\w\d_-]{11})/
      )?.[1];
      setVideoId(id);
    } catch (error) {
      console.error('Error setting YouTube video id:', error);
    }
  }, [youtubeUrl]);

  const playerContainerStyle = {
    position: 'relative',
    width: '100%',
    paddingTop: '56.25%', // 16:9 aspect ratio (9 / 16 * 100%)
    overflow: 'hidden', // Ensure iframe doesn't overflow container
  };

  const iframeStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    border: 'none', // Remove iframe border
  };

  return (
    <div style={playerContainerStyle}>
      {videoId && (
        <iframe
          title="YouTube video player"
          style={iframeStyle}
          src={`https://www.youtube.com/embed/${videoId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
};

export default YoutubePlayer;
