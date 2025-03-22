"use client"

import React, { useContext, useState, useRef, useEffect } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Link } from '@mui/material';
import { Dialog, DialogTitle, List, ListItem, ListItemText, Divider, Button } from '@mui/material';
import { NewsContext } from '../../contexts/NewsContext';
import { useRouter } from 'next/navigation';
import BlinkingText from './blinkingText';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const SadEmoji = () => (
  <span role="img" aria-label="sad emoji">
    😞
  </span>
);

export default function TopNav() {
  const {news} = useContext(NewsContext);
  const newsArray = news;
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const navigate = useRouter().push;
  const [searchActive, setSearchActive] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (!searchActive && searchInputRef.current) {
      searchInputRef.current.blur(); // Remove focus from search input
    }
  }, [searchActive]);

  const handleSearch = () => {
    // Filter newsArray based on searchQuery
    const results = newsArray.filter(news =>
      news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(news.tags) && news.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    );
    setSearchResults(results);
    if (results.length > 0) {
      setDialogTitle(`Search Results for "${searchQuery}"`);
    } else {
      setDialogTitle(`No results found for "${searchQuery}"`);
    }
    setOpenDialog(true);
    setSearchQuery('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleResultClick = (category, id) => {
    setOpenDialog(false);
    navigate(`/${category}/${id}`);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between', backgroundColor: "#F82248" }}>
          <Link href='https://youtube.com/@ReachMalayalam?si=WPs_Yf-j2thMGZet' sx={{ textDecoration: 'none', color: 'inherit' }} target="_blank">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <YouTubeIcon />
            </IconButton>
            <Typography
              variant="body1"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'inline' } }}
            >
              Subscribe Now!
            </Typography>
          </Link>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              disabled={openDialog} // Disable input when dialog is open
              ref={searchInputRef} // Reference for input
              onClick={() => setSearchActive(true)} // Set searchActive to true on click
              onBlur={() => setSearchActive(false)} // Set searchActive to false on blur
            />
          </Search>
        </Toolbar>
      </AppBar>
      <Dialog open={openDialog} onClose={handleCloseDialog} sx={{ maxWidth: 'sm', width: '100%', '& .MuiDialog-paper': { maxWidth: 'sm', width: '100%' }, justifySelf:'center' }}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        {searchResults.length > 0 ? (
          <>
            <List>
              {searchResults.map((news, index) => (
                <React.Fragment key={index}>
                  <ListItem button onClick={() => handleResultClick(news.category, news.id)}>
                    <ListItemText primary={news.title} />
                  </ListItem>
                  {index < searchResults.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </>
        ) : (
          <Typography sx={{ textAlign: 'center', mt: 2 }}>
            {SadEmoji()} {dialogTitle} {SadEmoji()}
            <Typography variant="body2" sx={{ mt: 1 }}>
              If you think this is an error, try again with a more specific keyword.
            </Typography>
          </Typography>
        )}
        <Button onClick={handleCloseDialog} sx={{ position: 'absolute', top: '10px', right: '10px', marginTop:'-10px' }}>Close</Button>
      </Dialog>
      <Box sx={{display:'flex', flexDirection:'row' ,  justifyContent:'center', pt:1 }}>
        <BlinkingText  text={` ⓘ WEBSITE UNDER DEVELOPMENT`}/>
      </Box>
    </Box>
  );
}
