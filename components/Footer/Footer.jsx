"use client"

import React, { useState } from 'react';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import {  useAuth } from '../../contexts/AuthContext'
import { useRouter as useNavigate } from 'next/navigation';
import Link from 'next/link';
import { Container, Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, Snackbar, Alert, Slide, Grid, Typography } from '@mui/material';
import XIcon from '@mui/icons-material/X';
import pages from '../Navbar/Categories';
import capitalizeFirstLetter from '../../Utils/CapitalizeFirstLetter';
import styles from './Footer.module.css'
import Image from 'next/image';


// Transition component for Dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


function Footer() {
  const { currentUser } = useAuth();
  const navigate = useNavigate().push;

  // Initialize state to manage the visibility of the sign-out dialog
  const [openSignOutDialogue, setOpenSignOutDialogue] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info', // Corrected to 'info'
  });

  const handleOpenSignOutDialogue = () => setOpenSignOutDialogue(true);
  const handleCloseSignOutDialogue = () => setOpenSignOutDialogue(false);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
      window.scrollTo(0, 0);
      // Reset the state controlling the sign-out dialog
      setOpenSignOutDialogue(false);

    } catch (error) {
      // Directly use error message from Firebase
      setSnackbar({ open: true, message: error.message, severity: 'error' });
      console.error(error.message)
    }
  };


  // Function to render admin links based on user authentication
  const renderAdminLinks = () => {
    if (currentUser) {
      return (
        <>

          <Link  href="/admin"  style={{ marginBottom: '0.5rem', textDecoration: 'none',color : "inherit" }}>Admin Page</Link>
          <Link  href="/admin/news-manager"  style={{ marginBottom: '0.5rem', textDecoration: 'none', color : "inherit" }}>News Manager</Link>
          <Link  href="/admin/add-news"  style={{ marginBottom: '0.5rem', textDecoration: 'none', color : "inherit"  }}>Add News</Link>
          <a  component="button" onClick={handleOpenSignOutDialogue}  style={{ marginBottom: '0.5rem', textDecoration: 'none', color : "inherit" }}>Logout</a>

          <Dialog
            open={openSignOutDialogue}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseSignOutDialogue}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Are you sure you want to sign out?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseSignOutDialogue} color="primary">Cancel</Button>
              <Button onClick={handleSignOut} color="secondary">Sign Out</Button>
            </DialogActions>
          </Dialog>

          <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
            <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
              {snackbar.message}
            </Alert>
          </Snackbar>


        </>
      );
    } else {
      return (
        <Link  href="/login"  style={{ marginBottom: '0.5rem', textDecoration: "none" , color : "inherit"}}>Login</Link>
      );
    }
  };


  // Get current year for showing in copyright
  const currentYear = new Date().getFullYear();

  return (
    <Box style={{ backgroundColor: '#181818', color: 'white', marginTop: '1rem' }}>
      <hr />
      <Container>

        {/* Reach Malayalam logo */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: '1rem' }}>
          <Image src="/logo512.png" alt="Reach Malayalam Logo" width={300} height={300}  layout='responsive' style={{ maxWidth: '150px' }} unoptimized={true} />
        </div>
        {/* Social media icons */}
        <div className="social" style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', paddingBottom: '1rem', marginLeft: '0.5rem' }}>
          <Link href="https://www.youtube.com/@ReachMalayalam" target="_blank"><YouTubeIcon style={{ paddingRight: '.5rem', paddingTop: '.4rem', color: 'white' }} /></Link>
          <Link href="https://www.facebook.com/people/Reach-Malayalam/61558387040194/" target="_blank"><FacebookIcon style={{ paddingRight: '.5rem', paddingTop: '.4rem', color: 'white' }} /></Link>
          <Link href="https://www.instagram.com/" target="_blank"><InstagramIcon style={{ paddingRight: '.5rem', paddingTop: '.4rem', color: 'white' }} /></Link>
          <Link href="https://twitter.com/?lang=en" target="_blank"><XIcon style={{ paddingRight: '.5rem', paddingTop: '.4rem', color: 'white' }} /></Link>

        </div>




        <Grid container paddingBottom="2rem" marginTop="1rem" >
          {/*  Popular Categories section */}
          <Grid item xs={12} sm={8} md={8} mb={2}>
            <Typography variant="h6" gutterBottom component="div" sx={{ textAlign: 'left' }}>
              Popular Categories
            </Typography>
            <hr style={{marginBottom:'0.5rem'}}/>
            <Box display={`flex`} justifyContent={`flex-start`} width="100%">
              <Box display="flex" flexDirection="column" justifyContent="center" alignItems={`flex-start`} width="50%">
                {/* Render the first half of pages */}
                {pages.slice(0, Math.ceil(pages.length / 2)).map((page, index) => (
                  <Link key={index}  href={`/${page.english}`} className={styles.link} style={{ marginBottom: '0.5rem', textDecoration: 'none' }}>{capitalizeFirstLetter(page.english)}</Link>
                ))}
              </Box>
              <Box display="flex" flexDirection="column" justifyContent="center" alignItems={`flex-start`} width="50%">
                {/* Render the second half of pages */}
                {pages.slice(Math.ceil(pages.length / 2)).map((page, index) => (
                  <Link key={index}  href={`/${page.english}`} className={styles.link} style={{ marginBottom: '0.5rem', textDecoration: 'none' }}>{capitalizeFirstLetter(page.english)}</Link>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Useful Links */}
          <Grid item xs={12} sm={4} md={4} >
            <Typography variant="h6" gutterBottom component="div" sx={{ textAlign: 'left' }}>
              Useful Links
            </Typography>
            <hr style={{marginBottom:'0.5rem'}}/>
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="flex-start" width="50%">
              <Link  href="#"  style={{ marginBottom: '0.5rem', textDecoration: 'none', color:"inherit" }}>About</Link>
              <Link  href="#"  style={{ marginBottom: '0.5rem', textDecoration: 'none', color:"inherit" }}>Contact</Link>
              <Link  href="#"  style={{ marginBottom: '0.5rem', textDecoration: 'none' , color:"inherit"}}>Complaints</Link>
              {/* Render admin links */}
              {renderAdminLinks()}
            </Box>
          </Grid>
        </Grid>

        <div style={{ display: 'flex', flexDirection: "column", alignItems: "center", justifyContent: 'flex-start', paddingBottom: "2rem" }}>
          {/* Copyright */}
          <Typography variant='body4'>
            ©{currentYear}, Reach Malayalam.
          </Typography>
          <Typography variant='body4'>
            All Rights Reserved.
          </Typography>
        </div>
      </Container>
    </Box>
  );
}

export default Footer;
