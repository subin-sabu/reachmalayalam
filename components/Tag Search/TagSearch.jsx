import React, { useState, useContext } from 'react';
import { Typography, Box, Link, Dialog, DialogTitle, List, ListItem, ListItemText, Divider, Button } from '@mui/material';
import { NewsContext } from '../../contexts/NewsContext';
import { useRouter } from 'next/navigation'

const TagSearch = ({ tags }) => {
  const { news } = useContext(NewsContext);
  const newsArray = news;
  const [searchResults, setSearchResults] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const navigate = useRouter().push;

  const handleTagClick = (tag) => {
    // Filter newsArray based on the clicked tag
    const results = newsArray.filter(news =>
      (Array.isArray(news.tags) && news.tags.some(newsTag => newsTag.toLowerCase() === tag.toLowerCase()))
    );
    setSearchResults(results);
    if (results.length > 0) {
      setDialogTitle(`Search Results for "${tag}"`);
    } else {
      setDialogTitle(`No results found for "${tag}"`);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleResultClick = (category, id) => {
    setOpenDialog(false);
    navigate(`/${category}/${id}`);
  };

  const filteredTags = tags.filter(tag => tag.toLowerCase() !== 'main');

  return (
    <Box>
      {filteredTags && filteredTags.length > 0 ? (
        <Typography variant="body1" marginLeft={2} marginRight={2}>
          Keywords: {filteredTags.map((tag, index) => (
            <Link
              key={index}
              component="button"
              variant="body1"
              onClick={() => handleTagClick(tag)}
              sx={{ marginRight: 1, cursor: 'pointer', textDecoration: 'none' }}
            >
              {tag}{index < filteredTags.length - 1 ? ',' : ''}
            </Link>
          ))}
        </Typography>
      ) : (
        <Typography variant="body1" marginLeft={2} marginRight={2}>No keywords</Typography>
      )}
      <Dialog open={openDialog} onClose={handleCloseDialog} sx={{ maxWidth: 'sm', width: '100%', '& .MuiDialog-paper': { maxWidth: 'sm', width: '100%' }, justifySelf:'center' }}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        {searchResults.length > 0 ? (
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
        ) : (
          <Typography sx={{ textAlign: 'center', mt: 2 }}>
            😞 {dialogTitle} 😞
            <Typography variant="body2" sx={{ mt: 1 }}>
              If you think this is an error, try again with a more specific keyword.
            </Typography>
          </Typography>
        )}
        <Button onClick={handleCloseDialog} sx={{ position: 'absolute', top: '10px', right: '10px', marginTop:'-10px' }}>Close</Button>
      </Dialog>
    </Box>
  );
};

export default TagSearch;
