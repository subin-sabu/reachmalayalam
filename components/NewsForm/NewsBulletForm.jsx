"use client"

import React, { useState, useEffect } from 'react'
import { db, storage } from '../../lib/firebase'
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
import { collection, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Resizer from 'react-image-file-resizer';
import Image from 'next/image';
const uuidv4 = require('uuid').v4; // Import uuidv4 library

export const NewsBulletForm = () => {
  // Scrolls to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    imageFile: null,
    imageUrl: '',
    link: '',
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  //current user info is taken to get reporter's email
  const { currentUser } = useAuth();

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
  }

  const handleCancel = (type) => {
    switch (type) {
      case 'imageUrl':
        setImagePreview('');
        setFormValues(prev => ({ ...prev, imageFile: null }));
        break;
    }
  }

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
  const resizeAndUploadImage = async (file, path, maxWidth, maxHeight,) => {
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

    // creating document name with a fixed time (the moment user press the submit button) to reference it in multiple places like  Firestore as document.id .
    const submitTimestamp = new Date().toISOString();

    let imageUrl = null;
    let imagePath = null;

    // Resize and upload image for thumbnailUrl
    if (formValues.imageFile) {
      // Resize and upload image for imageUrl
      const imageResult = await resizeAndUploadImage(formValues.imageFile, 'bullets', 100, 100);
      imageUrl = imageResult.url;
      imagePath = imageResult.fullPath;
    }

    const newsData = {
      imageUrl,
      imagePath,
      timestamp: new Date(),
      reporterEmail: currentUser.email,
      title: formValues.title || null,
      description: formValues.description || null,
      link: formValues.link || null,
    }

    try {
      const docRef = doc(collection(db, "bullets"), submitTimestamp);
      await setDoc(docRef, newsData);
      setLoading(false);
      alert('News uploaded successfully');
      setImagePreview('');
      setFormValues({
        title: '',
        imageUrl: '',
        imageFile: null,
        description: '',
        link: '',
      });
    } catch (error) {
      console.error('Error uploading news: ', error);
      setLoading(false);
      alert('Error uploading news. Please try again.\n' + error.message);
    }
  };


  //Home button with page refresh
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
          News Bullet Manager
        </Button>
        <Button onClick={redirectAndRefresh} variant="contained" color="primary" sx={{ display: { xs: 'none', sm: 'block' } }}>
          Home
        </Button>

      </div>
      <Container>
        <form onSubmit={handleSubmit}>
          <Typography variant="caption" gutterBottom color={`secondary.main`}>
            <span style={{ fontWeight: 500 }}>ⓘ Read Me:</span> 
            Providing Link means users will be redirected to other websites. 
          </Typography>
          <Typography variant="h6" gutterBottom paddingTop={2}>
            News Bullets (or headlines)
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
                  <Image src={imagePreview} alt="Preview" width={100} height={100} layout='responsive' style={{ maxHeight: 100, width: 'auto', margin: '10px 0' }} />
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

  )
}

