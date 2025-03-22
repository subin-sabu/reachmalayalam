"use client"

import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'next/navigation';
import {
  Button,
  FormControl,
  FormLabel,
  TextField,
  Typography,
  CircularProgress,
  Container,
} from '@mui/material';
import {  doc, getDoc, updateDoc } from 'firebase/firestore';
import {  ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../lib/firebase'; //  db is correctly initialized in config file
import Resizer from 'react-image-file-resizer';
import { BulletContext } from '../../contexts/BulletContext';
import Image from 'next/image';
const uuidv4 = require('uuid').v4; // Import uuidv4 library


const EditBullet = ({id}) => {

  // Scrolls to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  //States for Fetching data with id
  const newsArray = useContext(BulletContext);
  const [newsItem, setNewsItem] = useState(null);
  const [loading1, setLoading1] = useState(true);

  useEffect(() => {
    const item = newsArray.find(news => news.id === id);
    if (item) {
      setNewsItem(item);
      setLoading1(false);
    } else {
      fetchNewsFromFirebase(id);
    }
  }, [id, newsArray]);

  const fetchNewsFromFirebase = async (newsId) => {
    setLoading1(true);
    try {
      const docRef = (db, 'bullets', newsId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setNewsItem({ id: docSnap.id, ...docSnap.data() });
        setLoading1(false);
        return;
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error getting document:", error);
    }
  }


  const [formValues, setFormValues] = useState({
    title: '',
    imageFile: null,
    imageUrl: '',
    imagePath: '',
    description: '',
    link: '',
  });

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (newsItem) {
      setFormValues({
        title: newsItem.title || '',
        imageFile: null,
        imageUrl: newsItem.imageUrl || '',
        imagePath: newsItem.imagePath || '',
        description: newsItem.description || '',
        link: newsItem.link || ''
      });
      // Set image previews if corresponding URLs have initial values
      if (newsItem.imageUrl) setImagePreview(newsItem.imageUrl);
    }

  }, [newsItem]);


  //current user info is taken to get reporter's email
  const { currentUser } = useAuth();
  // console.log(currentUser.email)

  //to redirect to '/admin' when news submission is successful
  const navigate = useRouter().push;


  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "imageFile" && files && files.length > 0) {
      try {
        setFormValues(prev => ({ ...prev, [name]: files[0] }));
        setImagePreview(URL.createObjectURL(files[0]));
      } catch (error) {
        console.error("Error creating object URL for imageFile:", error);
      }
    } else {
      // Set the form values without clearing the preview explicitly
      setFormValues(prev => ({ ...prev, [name]: value }));
    }
  };



  const handleCancel = (type) => {

    switch (type) {
      case 'imageUrl':
        setImagePreview('');
        setFormValues(prev => ({ ...prev, imageFile: null, imageUrl: null, thumbnailUrl: null }));
        break;
    }
  };

  // Function to delete a file from Firebase Storage based on its path
  const deleteFile = async (path) => {
    try {
      await deleteObject(ref(storage, path));
    } catch (error) {
      throw new Error('Error deleting file from Firebase Storage:', error);
    }
  };

  const deleteFilesWithoutUrls = async () => {
    try {
      // Check conditions for paths remaining without a URL        
      // Delete the corresponding files from Firebase Storage
      if (formValues.imageUrl === null && formValues.imagePath) {
        await deleteFile(formValues.imagePath);
      }
    } catch (error) {
      console.error('Error deleting files:', error);
      // Handle error as needed
    }
  };

  const clearPathsWithoutUrls = () => {
    // Check conditions for paths remaining without a URL
    if (formValues.imageUrl === null && formValues.imagePath) {
      // Set corresponding paths to null
      setFormValues(prev => ({
        ...prev,
        imagePath: null,
      }));
    }
  };


  // Function to resize the image
  const resizeFile = (file, maxWidth, maxHeight) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        maxWidth,
        maxHeight,
        'JPEG',
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        'file',
      );
    });


  // Function to resize and upload image
  const resizeAndUploadImage = async (file, path, maxWidth, maxHeight) => {
    const resizedImage = await resizeFile(file, maxWidth, maxHeight);
    return uploadFile(resizedImage, path);
  };

  const uploadFile = async (file, path) => {
    try {
      // Generate a UUIDv4 string
      const uuid = uuidv4();

      // Construct new file name with UUIDv4 and original file name
      const newFileName = `${uuid}_${file.name}`;

      // Create a storage reference with the new file name
      const fileRef = ref(storage, `${path}/${newFileName}`);

      // Upload the file to Firebase Storage
      const snapshot = await uploadBytes(fileRef, file);
      const url = await getDownloadURL(snapshot.ref);

      // Construct full Firestore path
      const fullPath = `${path}/${newFileName}`;

      // Return an object containing URL and full Firestore path
      return { url, fullPath };
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };




  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Delete files without URLs
    await deleteFilesWithoutUrls();

    // Clear paths without URLs
    clearPathsWithoutUrls();



    let imageUrl = formValues.imageUrl || null;
    let imagePath = formValues.imagePath || null;

    // Resize and upload image for thumbnailUrl
    if (formValues.imageFile) {

      // Resize and upload image for imageUrl
      const imageResult = await resizeAndUploadImage(formValues.imageFile, 'images', 100, 100);
      imageUrl = imageResult.url;
      imagePath = imageResult.fullPath;
    }


    //avoided spreading of formValues (like ...formValues) in NewsData to exclude null imageFiles and videoFile 
    const newsData = {
      imageUrl,
      imagePath,
      editedTime: new Date(),
      editorEmail: currentUser.email,
      timestamp: newsItem.timestamp,
      reporterEmail: newsItem.reporterEmail,
      title: formValues.title || null,
      description: formValues.description || null,
      link: formValues.link || null,
    };

    try {
      const docRef = doc(db, 'bullets', id);
      await updateDoc(docRef, newsData);
      setLoading(false);
      alert('News updated successfully');
      navigate('/admin/news-bullet-manager');

    } catch (error) {
      console.error('Error updating news: ', error);
      setLoading(false);
      alert('Error updating news. Please try again.\n' + error.message);

    }
  };

  //button go cancel and go back
  const cancelAndGoBack = () => {
    navigate('/admin/news-bullet-manager');
  };

  //button go redirect and refresh
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
        <Button onClick={() => navigate('/admin/news-bullet-manager')} variant="contained" color="primary">
          News Bullets Manager
        </Button>
        <Button onClick={redirectAndRefresh} variant="contained" color="primary" sx={{ display: { xs: 'none', sm: 'block' } }}>
          Home
        </Button>

      </div>
      <Container>
        <form onSubmit={handleSubmit}>
          <Typography variant="caption" gutterBottom color={`secondary.main`}>
            <span style={{ fontWeight: 500 }}>ⓘ Read Me:</span>
             Changes will be applied only if you &apos;submit&apos; the form.
          </Typography>
          <Typography variant="h6" gutterBottom paddingTop={2}>
            News Bullets Edit Form
          </Typography>

          <TextField
            label="Short Title"
            variant="outlined"
            name="title"
            value={formValues.title}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            multiline
            rows={2}
          />
          <TextField
            label="Long Title or Description"
            variant="outlined"
            name="description"
            value={formValues.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={7}
          />
          <TextField
            label="Link to News Source- optional"
            variant="outlined"
            name="link"
            value={formValues.link}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          {/* image */}
          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend" sx={{ fontWeight: '500', marginBottom: '.5rem', color: '#181818' }}>Icon Image (required) </FormLabel>
            <FormLabel component="legend" sx={{ color: 'success.main' }}>ⓘ (Preferred Aspect Ratio: 1:1) </FormLabel>

            <>
              {imagePreview && (
                <>
                  <Image  style={{ maxHeight: 100, width: 'auto', margin: '10px 0' }} 
                  src={imagePreview} alt="Preview" layout='responsive' unoptimized={true} width={100} height={100} />
                  <Typography variant="body2" >{formValues.imageFile && formValues.imageFile.name}</Typography>
                  <Button variant="contained" color="warning" onClick={() => handleCancel('imageUrl')} style={{ marginTop: '10px', marginBottom: '10px' }}>
                    Cancel Upload
                  </Button>
                </>
              )}
              <Button variant="contained" component="label">
                Upload Image
                <input type="file" hidden name="imageFile" onChange={handleChange} accept="image/*" />
              </Button>
            </>

          </FormControl>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '2rem', paddingBottom: '0.5rem' }}>
            {/* Submit Button */}
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
            {/* Button to redirect and refresh */}
            <Button variant="contained" color="tertiary" onClick={redirectAndRefresh}>
              Go to Home Page
            </Button>
          </div>
        </form>
      </Container>
    </div>
  );
};

export default EditBullet;