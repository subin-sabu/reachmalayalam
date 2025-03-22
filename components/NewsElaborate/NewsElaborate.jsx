// components/NewsElaborate/NewsElaborate.jsx

"use client"

import React, { useState } from 'react';
import { Paper, CardContent, Typography, Box, CardMedia, IconButton, Link as MuiLink } from '@mui/material';
import HomeAd1 from '../Advertisements/SamsungAd';
import { dateTimeFromMilliSeconds, indianTimestamp, indianTimestampFromMilliSeconds } from '../../Utils/FormatTimestamp';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import XIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';
import EmailIcon from '@mui/icons-material/Email';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import VideoPlayer from '../iFrame Container/VideoPlayer';
import YoutubePlayer from '../iFrame Container/YoutubePlayer';
import InstagramPlayer from '../iFrame Container/InstagramPlayer';
import TagSearch from '../Tag Search/TagSearch';
import Image from 'next/image';

const NewsElaborate = ({ id, className, newsData }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  if (!newsData) {
    return <div style={{ fontSize: '20px' }}><br /><br />News not found 😞<br /><br /></div>;
  }

  const newsItem = newsData;

  const handleCopyLink = () => {
    const link = `${window.location.href}`;
    navigator.clipboard.writeText(link);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleWhatsAppShare = () => {
    const link = `${window.location.href}`;
    const encodedTitle = encodeURIComponent(newsItem.title);
    const encodedLink = encodeURIComponent(link);
    window.open(`https://api.whatsapp.com/send?text=${encodedTitle}%0A${encodedLink}`, '_blank');
  };

  const handleTwitterShare = () => {
    const link = `${window.location.href}`;
    const title = encodeURIComponent(newsItem.title);
    const encodedLink = encodeURIComponent(link);
    window.open(`https://twitter.com/intent/tweet?url=${encodedLink}&text=${title}`, '_blank');
  };

  const handleFacebookShare = () => {
    const link = `${window.location.href}`;
    const title = encodeURIComponent(newsItem.title);
    const encodedLink = encodeURIComponent(link);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedLink}&title=${title}`, '_blank');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent('Check out this news on Reach Malayalam!');
    const body = encodeURIComponent(`${newsItem.title}, Click the link to read. ${window.location.href}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleCopy = (event) => {
    const selection = window.getSelection().toString().trim();
    const maxLength = 250;
    const promoMessage = `... \nTo read the full article, visit ${window.location.href}`;

    if (selection.length > maxLength) {
      event.preventDefault(); // Prevent the default copy action

      const truncatedText = selection.substring(0, maxLength) + promoMessage;
      const clipboardData = event.clipboardData || window.clipboardData;
      clipboardData.setData('text/plain', truncatedText); // Set the truncated text and promo message in the clipboard
    }
  };
  return (
    <Box className={className} sx={{ marginTop: '.5rem' }}>

      <Paper sx={{ maxWidth: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'white', alignContent: 'center' }}>

        <CardContent sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <Typography gutterBottom variant='h6' fontWeight='900' component="div" sx={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', wordBreak: 'break-word' }}>
              {newsItem.title}
            </Typography>

            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Typography variant="caption" color='text.secondary' component="div" sx={{ marginRight: '1rem' }} >
                {newsItem.reporterName}
              </Typography>

              <Typography variant="caption" color='text.secondary' component="div" sx={{ marginRight: '1rem' }}>
                {dateTimeFromMilliSeconds(newsItem.timestamp) }
              </Typography>

            </div>
          </div>
        </CardContent>

        {newsItem.imageUrl &&
          <Image
          src={newsItem.imageUrl}
          width={820}
          height={600}
          layout='responsive'
          unoptimized={true}
          alt='main image of news'
          />}

        {newsItem.imageCredit && (
          <Box p={2} pb={0} pt={1}>
            <Typography variant="caption" color='text.secondary' component="div" sx={{ wordBreak: 'break-word' }} >
              {`${newsItem.imageCredit}`}
            </Typography>
          </Box>
        )}

        {(newsItem.heading1 || newsItem.description1) &&
          <CardContent onCopy={handleCopy} sx={{ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '0.5rem' }}>
            <Typography gutterBottom variant="body1" pb={1} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', flexDirection: 'column', fontWeight: '600', wordBreak: 'break-word' }}>
              {newsItem.heading1}
            </Typography>
            {newsItem.description1 &&
              <Typography variant="body1"  sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', flexDirection: 'column' }}>

                {newsItem.description1.split('\n').map((line, index) => (
                  <div key={index} style={{ margin: '0.2rem 0', wordBreak: 'break-word' }}>{line}</div>
                ))}
              </Typography>}
          </CardContent>}

        {/* image 2 */}
        {newsItem.imageUrl1 &&
          <Image
          src={newsItem.imageUrl1}
          width={820}
          height={600}
          layout='responsive'
          unoptimized={true}
          alt=' image 2 of news'
          />}
        {newsItem.imageCredit1 && (
          <Box p={2} pb={0} pt={1}>
            <Typography variant="caption" color='text.secondary' component="div" sx={{ wordBreak: 'break-word' }} >
              {`${newsItem.imageCredit1}`}
            </Typography>
          </Box>
        )}



        {(newsItem.heading2 || newsItem.description2) &&
          <CardContent onCopy={handleCopy} sx={{ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '0.5rem' }}>
            <Typography gutterBottom variant="body1" pb={1} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', flexDirection: 'column', fontWeight: '600', wordBreak: 'break-word' }}>
              {newsItem.heading2}
            </Typography>
            {newsItem.description2 &&
              <Typography variant="body1" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', flexDirection: 'column' }} component="div">
                {newsItem.description2.split('\n').map((line, index) => (
                  <div key={index} style={{ margin: '0.2rem 0', wordBreak: 'break-word' }}>{line}</div>
                ))}
              </Typography>}
          </CardContent>
        }


        <HomeAd1 />
        {/* image 3 */}
        {newsItem.imageUrl2 &&
          <Image
          src={newsItem.imageUrl2}
          width={820}
          height={600}
          layout='responsive'
          unoptimized={true}
          alt=' image 3 of news'
          />}
        {newsItem.imageCredit2 && (
          <Box p={2} pb={1} pt={1} >
            <Typography variant="caption" color='text.secondary' component="div" sx={{ wordBreak: 'break-word' }}>
              {`${newsItem.imageCredit2}`}
            </Typography>
          </Box>
        )}

        {/* heading  3 */}
        {(newsItem.heading3 || newsItem.description3) &&
          <CardContent onCopy={handleCopy} sx={{ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '0.3rem' }}>
            <Typography gutterBottom variant="body1" pb={1} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', flexDirection: 'column', fontWeight: '600', wordBreak: 'break-word' }}>
              {newsItem.heading3}
            </Typography>
            {newsItem.description3 &&
              <Typography variant="body1" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', flexDirection: 'column' }}>

                {newsItem.description3.split('\n').map((line, index) => (
                  <div key={index} style={{ margin: '0.2rem 0', wordBreak: 'break-word' }}>{line}</div>
                ))}
              </Typography>}
          </CardContent>
        }
          {/* image 4 */}
        {newsItem.imageUrl3 &&
          <Image
          src={newsItem.imageUrl3}
          width={820}
          height={600}
          layout='responsive'
          unoptimized={true}
          alt=' image 4 of news'
          />}
        {newsItem.imageCredit3 && (
          <Box p={2} pb={1} pt={1} >
            <Typography variant="caption" color='text.secondary' component="div" sx={{ wordBreak: 'break-word' }} >
              {`${newsItem.imageCredit3}`}
            </Typography>
          </Box>
        )}

        {newsItem.youtubeUrl &&
          <Box p={2} pb={0} pt={1}>
            {/* Youtube Player */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <YoutubePlayer youtubeUrl={newsItem.youtubeUrl} />
              {newsItem.youtubeCredit &&
                <Typography variant="caption" color='text.secondary' component="div" pb={0} pt={1} sx={{ wordBreak: 'break-word' }}>
                  {`${newsItem.youtubeCredit}`}
                </Typography>}
            </div>
          </Box>}


        {/* heading 4 */}
        {(newsItem.heading4 || newsItem.description4) &&
          <CardContent onCopy={handleCopy} sx={{ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '0.5rem' }}>
            <Typography gutterBottom variant="body1" pb={1} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', flexDirection: 'column', fontWeight: '600', wordBreak: 'break-word' }}>
              {newsItem.heading4}
            </Typography>
            {newsItem.description4 &&
              <Typography variant="body1"  sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', flexDirection: 'column' }}>

                {newsItem.description4.split('\n').map((line, index) => (
                  <div key={index} style={{ margin: '0.2rem 0', wordBreak: 'break-word' }}>{line}</div>
                ))}
              </Typography>}
          </CardContent>
        }



        {newsItem.videoUrl &&
          <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', paddingTop: '0.5rem' }}>
            {/* Video Player */}
            <VideoPlayer videoURL={newsItem.videoUrl} />
            {newsItem.videoCredit &&
              <Typography variant="caption" color='text.secondary' component="div" pt={1} pb={0} sx={{ wordBreak: 'break-word' }}>
                {`${newsItem.videoCredit}`}
              </Typography>}
          </CardContent>}

        {newsItem.videoUrl && newsItem.instagramUrl && <HomeAd1 />}

        {newsItem.instagramUrl &&
          <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', paddingTop: '0.5rem' }}>
            {/* Instagram Player */}
            <Box sx={{
              display: 'flex', flexDirection: 'column', height
                : '75vh', maxWidth: { sm: 450 },
            }}>
              <InstagramPlayer instagramUrl={newsItem.instagramUrl} />
              {newsItem.instagramCredit &&
                <Typography variant="caption" color='text.secondary' component="div" pt={1} sx={{ wordBreak: 'break-word' }} >
                  {`${newsItem.instagramCredit}`}
                </Typography>}
            </Box>
          </CardContent>}


        {(newsItem.heading5 || newsItem.description5 || newsItem.link) &&
          <CardContent onCopy={handleCopy} sx={{ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '0.5rem' }}>
            <Typography gutterBottom variant="body1" pb={1} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', flexDirection: 'column', fontWeight: '600', wordBreak: 'break-word' }}>
              {newsItem.heading5}
            </Typography>
            {newsItem.description5 &&
              <Typography variant="body1"  sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', flexDirection: 'column' }}>

                {newsItem.description5.split('\n').map((line, index) => (
                  <div key={index} style={{ margin: '0.2rem 0', wordBreak: 'break-word' }}>{line}</div>
                ))}
              </Typography>}

            {newsItem.link && (
              <MuiLink href={newsItem.link} target="_blank" sx={{ cursor: 'pointer', wordBreak: 'break-word' }}>
                {newsItem.link}
              </MuiLink>
            )}
          </CardContent>
        }

        {/* Keyword Search links */}
        <TagSearch tags={newsItem.tags} />

        {/* social button box */}
        <Box sx={{ display: 'flex', justifyContent: 'space-around', padding: '1rem 0' }}>
          {/* Share Button */}
          <IconButton onClick={handleCopyLink}>
            <FileCopyIcon style={{ color: '#F12148' }} />
          </IconButton>
          {/* WhatsApp Share Button */}
          <IconButton onClick={handleWhatsAppShare}>
            <WhatsAppIcon style={{ color: 'green' }} />
          </IconButton>
          {/* Twitter Share Button */}
          <IconButton onClick={handleTwitterShare}>
            <XIcon style={{ color: 'black' }} />
          </IconButton>
          {/* Facebook Share Button */}
          <IconButton onClick={handleFacebookShare}>
            <FacebookIcon style={{ color: '#1877F2' }} />
          </IconButton>
          {/* Email Share Button */}
          <IconButton onClick={handleEmailShare}>
            <EmailIcon style={{ color: '#ff5d5d' }} />
          </IconButton>
        </Box>
      </Paper>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          News link copied successfully
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default NewsElaborate;
