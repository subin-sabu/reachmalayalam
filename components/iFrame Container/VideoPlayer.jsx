import React, { useRef, useEffect, useState } from "react";

const VideoPlayer = ({ videoURL }) => {
  const videoRef = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement || !!document.webkitFullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullScreenChange);
    };
  }, []);

  useEffect(() => {
    const resizeVideo = () => {
      if (videoRef.current) {
        const video = videoRef.current;
        const parentWidth = video.parentElement.offsetWidth;
        const aspectRatio = video.videoWidth / video.videoHeight;

        video.style.width = "100%";
        video.style.height = `${parentWidth / aspectRatio}px`;
      }
    };

    resizeVideo();

    window.addEventListener("resize", resizeVideo);

    return () => {
      window.removeEventListener("resize", resizeVideo);
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
      <video
        controls
        style={{ display: "block", width: "100%", height: "auto" }}
        ref={videoRef}
        src={videoURL}
        title="Video content"
      />
    </div>
  );
};

export default VideoPlayer;
