"use client"

import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogTitle, Typography, IconButton, Menu, MenuItem, CircularProgress, Snackbar, useMediaQuery } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import {BulletContext} from '../../contexts/BulletContext'

const NewsBulletManager = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top of the page when the component mounts
  }, []);

  const [newsList, setNewsList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [currentNews, setCurrentNews] = useState(null);
  const [anchorEls, setAnchorEls] = useState({}); // Updated state for individual anchor elements
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const theme = useTheme();
  const mobileView = useMediaQuery(theme.breakpoints.down('sm'));

  const navigate = useRouter().push;

  // Use context to get the news array
  const newsArray = useContext(BulletContext);

  useEffect(() => {
    // If NewsContext is empty, try to get collection directly from db
    if (newsArray.length === 0) {
      setLoading(true);
      const fetchNews = async () => {
        try {
          const queryDescending = query(collection(db, 'bullets'), orderBy('timestamp', 'desc'));
          // Limit to 30 documents if newsArray is empty and you are directly fetching
          queryDescending.limit(15);
          const querySnapshot = await getDocs(queryDescending);
          setNewsList(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        } catch (error) {
          setSnackbar({ open: true, message: error.message });
        } finally {
          setLoading(false);
        }
      };
      fetchNews();
    } else {
      // NewsContext has data, show its documents in its original order
      setNewsList(newsArray);
    }

  },
    [newsArray]);

  const handleMenuClick = (event, news) => {
    setCurrentNews(news);
    setCurrentId(news.id);
    setAnchorEls({ ...anchorEls, [news.id]: event.currentTarget }); // Update anchorEls state with individual anchor element for each news item
  };

  const handleMenuClose = (newsId) => {
    setAnchorEls({ ...anchorEls, [newsId]: null }); // Close menu for the specific news item
  };

  const deleteFiles = async (news) => {
    const promises = [];
    if (news.imageFile) {
      const imageRef = ref(storage, news.imageFile);
      promises.push(deleteObject(imageRef));
    }
    if (news.videoFile) {
      const videoRef = ref(storage, news.videoFile);
      promises.push(deleteObject(videoRef));
    }
    await Promise.all(promises);
  };

  const handleDelete = async () => {
    setOpenDialog(false);
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'bullets', currentId));
      await deleteFiles(currentNews);
      setNewsList(newsList.filter(news => news.id !== currentId));
      setSnackbar({ open: true, message: 'News successfully deleted' });
    } catch (error) {
      setSnackbar({ open: true, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (news) => {
    setCurrentNews(news);
    setCurrentId(news.id); // Set the currentId when opening the delete dialog
    setOpenDialog(true);
    handleMenuClose(news.id); // Close the menu for this news item
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return <CircularProgress style={{ display: 'block', margin: '20px auto' }} />;
  }

  const redirectAndRefresh = () => {
    navigate('/');
    // window.location.reload();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-evenly', paddingBottom: '1rem', paddingTop: '1rem', marginBottom: '1rem', backgroundColor: '#F8F8F8' }}>
        <Button onClick={() => navigate('/admin')} variant="contained" color="primary">
          Admin Page
        </Button>
        <Button onClick={() => navigate('/admin/add-news-bullet')} variant="contained" color="primary">
          Add News Bullets
        </Button>
        <Button onClick={redirectAndRefresh} variant="contained" color="primary" sx={{ display: { xs: 'none', sm: 'block' } }}>
          Home
        </Button>
      </div>
      <div>
        <Typography variant="h5" gutterBottom component="div" sx={{ textAlign: 'center' }}>
          News Bullets Manager
        </Typography>
        <Typography variant='body3' component="div" sx={{ textAlign: 'center' }} color={`text.secondary`}> sort by: latest news first</Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 300 }} aria-label="news table">
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Title</TableCell>
                {!mobileView && (
                  <>
                    <TableCell>Edit</TableCell>
                    <TableCell>Delete</TableCell>
                  </>
                )}
                {mobileView && <TableCell></TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {newsList.map((news, index) => (
                <TableRow key={news.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell style={{wordBreak:'break-word'}}>{news.title}</TableCell>
                  {!mobileView && (
                    <>
                      <TableCell>
                        <Button onClick={() => navigate(`/admin/news-bullet-manager/edit/${news.id}`)} style={{ color: 'green' }}>
                          Edit
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => openDeleteDialog(news)} style={{ color: 'red' }}>
                          Delete
                        </Button>
                      </TableCell>
                    </>
                  )}
                  {mobileView && (
                    <TableCell>
                      <IconButton onClick={(event) => handleMenuClick(event, news)}>
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEls[news.id]}
                        open={Boolean(anchorEls[news.id])}
                        onClose={() => handleMenuClose(news.id)}
                      >
                        <MenuItem onClick={() => navigate(`/admin/news-bullet-manager/edit/${news.id}`)} style={{ color: 'green' }}>Edit</MenuItem>
                        <MenuItem onClick={() => openDeleteDialog(news)} style={{ color: 'red' }}>Delete</MenuItem>
                      </Menu>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog
          open={openDialog}
          onClose={handleDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete this news? This action is irreversible."}</DialogTitle>
          <DialogActions>
            <Button onClick={handleDialogClose} style={{ color: 'green' }}>Cancel</Button>
            <Button onClick={handleDelete} autoFocus style={{ color: 'red' }}>
              Confirm Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbar.message}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <Button onClick={redirectAndRefresh} variant="contained" color="primary" sx={{ display: { xs: 'block', sm: 'none' } }}>
          Go to Home Page
        </Button>
      </div>
    </div>
  );
};

export default NewsBulletManager;
