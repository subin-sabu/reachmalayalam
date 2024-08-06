"use client"

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Button,
  FormControl,
  FormLabel,
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  Container,
} from '@mui/material';
import { collection, doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../../lib/firebase'; //  db is correctly initialized in config file
import pages from '../Navbar/Categories';//to list categories
import Image from 'next/image';
import Resizer from "react-image-file-resizer";
const uuidv4 = require('uuid').v4; // Import uuidv4 library




// Initialize Storage
const storage = getStorage();

const NewsForm = () => {

  // Scrolls to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formValues, setFormValues] = useState({
    title: '',
    category: '',
    reporterName: '',
    tags: '',
    imageFile: null,
    imageUrl: '',
    imageCredit: '',
    imageFile1: null,
    imageUrl1: '',
    imageCredit1: '',
    imageFile2: null,
    imageUrl2: '',
    imageCredit2: '',
    imageFile3: null,
    imageUrl3: '',
    imageCredit3: '',
    youtubeUrl: '',
    youtubeCredit: '',
    videoUrl: '',
    videoFile: null,
    videoCredit: '',
    instagramUrl: '',
    instagramCredit: '',
    description1: '',
    heading1: '',
    description2: '',
    heading2: '',
    description3: '',
    heading3: '',
    description4: '',
    heading4: '',
    description5: '',
    heading5: '',
    link: '',

  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [imagePreview1, setImagePreview1] = useState('');
  const [imagePreview2, setImagePreview2] = useState('');
  const [imagePreview3, setImagePreview3] = useState('');
  const [videoPreview, setVideoPreview] = useState('');
  const [youtubePreview, setYoutubePreview] = useState('');
  const [instagramPreview, setInstagramPreview] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');


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
    } else if ((name === "imageFile1" || name === "imageFile2" || name === "imageFile3") && files && files.length > 0) {
      try {
        setFormValues(prev => ({ ...prev, [name]: files[0] }));
        // Set image preview based on the name of the input field
        switch (name) {
          case "imageFile1":
            setImagePreview1(URL.createObjectURL(files[0]));
            break;
          case "imageFile2":
            setImagePreview2(URL.createObjectURL(files[0]));
            break;
          case "imageFile3":
            setImagePreview3(URL.createObjectURL(files[0]));
            break;
          default:
            break;
        }
      } catch (error) {
        console.error("Error creating object URL for additional image files:", error);
      }
    } else if (name === "videoFile" && files && files.length > 0) {
      try {
        setFormValues(prev => ({ ...prev, [name]: files[0] }));
        setVideoPreview(URL.createObjectURL(files[0]));
      } catch (error) {
        console.error("Error creating object URL for videoFile:", error);
      }
    } else {
      // Set the form values without clearing the preview explicitly
      setFormValues(prev => ({ ...prev, [name]: value }));

      // Set the YouTube preview if the input field is for YouTube URL
      if (name === "youtubeUrl") {
        try {
          const videoId = value.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|watch\?v=|v\/|watch\?.+&v=))([\w\d_-]{11})/)?.[1];
          setYoutubePreview(`https://www.youtube.com/embed/${videoId}`);
        } catch (error) {
          console.error("Error setting YouTube preview:", error);
        }
      }

      // Set the Instagram preview if the input field is for Instagram URL
      if (name === "instagramUrl") {
        try {
          const urlParts = value.split('/');
          const videoId = urlParts[urlParts.length - 2]; // Get the second last part of the URL
          setInstagramPreview(`https://www.instagram.com/p/${videoId}/embed/`);
        } catch (error) {
          console.error("Error setting Instagram preview:", error);
        }
      }
    }
  };



  const handleCancel = (type) => {

    switch (type) {
      case 'imageUrl':
        setImagePreview('');
        setFormValues(prev => ({ ...prev, imageFile: null }));
        break;
      case 'imageUrl1':
        setImagePreview1('');
        setFormValues(prev => ({ ...prev, imageFile1: null }));
        break;
      case 'imageUrl2':
        setImagePreview2('');
        setFormValues(prev => ({ ...prev, imageFile2: null }));
        break;
      case 'imageUrl3':
        setImagePreview3('');
        setFormValues(prev => ({ ...prev, imageFile3: null }));
        break;
      case 'videoUrl':
        setVideoPreview('');
        setFormValues(prev => ({ ...prev, videoFile: null }));
        break;

    }
  };



  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
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





// function to revalidate ISR pages on submit
const revalidateCategoryWithHome = async (category) => {
  try {
    const response = await fetch('/api/revalidate/category-with-home', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category }),
    });
    if (response.ok) {
      console.log('Category and home pages revalidated');
    } else {
      alert('Failed to revalidate category and home pages');
    }
  } catch (error) {
    console.error('Error revalidating category and home pages:', error);
    alert('Error revalidating category and home pages');
  }
};

const makeUrlFriendly = (input) => {
  // Define a regular expression for all non-URL-friendly characters
  const regex = /[^a-zA-Z0-9]/g;
  
  // Replace all matches of the regex with a hyphen
  return input.replace(regex, '-');
};



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // creating document name with a fixed time (the moment user press the submit button) to reference it in multiple places like  Firestore as document.id .
    const submitTimestamp = new Date().toISOString();

    const newsId= makeUrlFriendly(submitTimestamp);




    let thumbnailUrl = null;
    let imageUrl = null;
    let imagePath = null;
    let thumbnailPath = null;

    // Resize and upload image for thumbnailUrl
    if (formValues.imageFile) {
      // Resize and upload image for thumbnailUrl
      const thumbnailResult = await resizeAndUploadImage(formValues.imageFile, 'images/thumbnails', 200, 150);
      thumbnailUrl = thumbnailResult.url;
      thumbnailPath = thumbnailResult.fullPath;

      // Resize and upload image for imageUrl
      const imageResult = await resizeAndUploadImage(formValues.imageFile, 'images', 820, 800);
      imageUrl = imageResult.url;
      imagePath = imageResult.fullPath;
    }

    //upload additional images and get link
    let imageUrl1 = null;
    let imagePath1 = null;
    let imageUrl2 = null;
    let imagePath2 = null;
    let imageUrl3 = null;
    let imagePath3 = null;



    // Resize and upload image for imageUrl1
    if (formValues.imageFile1) {
      const imageResult = await resizeAndUploadImage(formValues.imageFile1, 'images', 820, 800);
      imageUrl1 = imageResult.url;
      imagePath1 = imageResult.fullPath;
    }

    // Resize and upload image for imageUrl2
    if (formValues.imageFile2) {
      const imageResult = await resizeAndUploadImage(formValues.imageFile2, 'images', 820, 800);
      imageUrl2 = imageResult.url;
      imagePath2 = imageResult.fullPath;
    }

    // Resize and upload image for imageUrl3
    if (formValues.imageFile3) {
      const imageResult = await resizeAndUploadImage(formValues.imageFile3, 'images', 820, 800);
      imageUrl3 = imageResult.url;
      imagePath3 = imageResult.fullPath;
    }



    //upload video and get link
    let videoUrl = null;
    let videoPath = null;
    if (formValues.videoFile) {
      const videoData = await uploadFile(formValues.videoFile, 'videos');
      videoUrl = videoData.url;
      videoPath = videoData.fullPath;
    }
    //avoided spreading of formValues (like ...formValues) in NewsData to exclude null imageFiles and videoFile 
    const newsData = {

      imageUrl,
      thumbnailUrl,
      imageUrl1,
      imageUrl2,
      imageUrl3,
      videoUrl,
      imagePath,
      thumbnailPath,
      imagePath1,
      imagePath2,
      imagePath3,
      videoPath,
      timestamp: new Date(),
      tags: formValues.tags ? formValues.tags.split(',').map(tag => tag.trim()) : [],
      title: formValues.title || null,
      category: formValues.category || null,
      reporterName: formValues.reporterName || null,
      reporterEmail: currentUser.email,
      imageCredit: formValues.imageCredit || null,
      imageCredit1: formValues.imageCredit1 || null,
      imageCredit2: formValues.imageCredit2 || null,
      imageCredit3: formValues.imageCredit3 || null,
      videoCredit: formValues.videoCredit || null,
      youtubeUrl: formValues.youtubeUrl || null,
      youtubeCredit: formValues.youtubeCredit || null,
      description1: formValues.description1 || null,
      heading1: formValues.heading1 || null,
      description2: formValues.description2 || null,
      heading2: formValues.heading2 || null,
      description3: formValues.description3 || null,
      heading3: formValues.heading3 || null,
      description4: formValues.description4 || null,
      heading4: formValues.heading4 || null,
      description5: formValues.description5 || null,
      heading5: formValues.heading5 || null,
      link: formValues.link || null,
      instagramUrl: formValues.instagramUrl || null,
      instagramCredit: formValues.instagramCredit || null,
    };

    try {
      const docRef = doc(collection(db, "news"), newsId);
      await setDoc(docRef, newsData);
      setLoading(false);
      alert('News uploaded successfully');
      revalidateCategoryWithHome(newsData.category);
      setImagePreview('');
      setImagePreview1('');
      setImagePreview2('');
      setImagePreview3('');
      setVideoPreview('');
      setFormValues({
        title: '',
        category: '',
        reporterName: '',
        tags: '',
        imageUrl: '',
        imageUrl1: '',
        imageUrl2: '',
        imageUrl3: '',
        imageFile: null,
        imageFile1: null,
        imageFile2: null,
        imageFile3: null,
        imageCredit: '',
        imageCredit1: '',
        imageCredit2: '',
        imageCredit3: '',
        videoUrl: '',
        videoFile: null,
        videoCredit: '',
        youtubeUrl: '',
        youtubeCredit: '',
        description1: '',
        heading1: '',
        description2: '',
        heading2: '',
        description3: '',
        heading3: '',
        description4: '',
        heading4: '',
        description5: '',
        heading5: '',
        link: '',
        instagramUrl: '',
        instagramCredit: '',
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


  // Define an array of additional label texts
  const additionalLabels = [
    'ⓘ Main Image is displayed here',
    'ⓘ Image 2 is displayed here',
    'ⓘ Advertisement , then Image 3 ',
    'ⓘ Image 4 , then Youtube Video',
    'ⓘ Uploaded Video, then Instagram Reel'
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-evenly', paddingBottom: '1rem', paddingTop: '1rem', marginBottom: '1rem', backgroundColor: '#F8F8F8' }}>
        <Button onClick={() => navigate('/admin')} variant="contained" color="primary">
          Admin Page
        </Button>
        <Button onClick={() => navigate('/admin/news-manager')} variant="contained" color="primary">
          News Manager
        </Button>
        <Button onClick={redirectAndRefresh} variant="contained" color="primary" sx={{ display: { xs: 'none', sm: 'block' } }}>
          Home
        </Button>

      </div>
      <Container>
        <form onSubmit={handleSubmit}>
          <Typography variant="caption" gutterBottom color={`secondary.main`}>
            <span style={{ fontWeight: 500 }}>ⓘ Read Me:</span> Positions of Images and Videos are fixed. Utilize the five heading and paragraph postions to get a desired arrangement. You can safely ignore unwanted columns.
          </Typography>
          <Typography variant="h6" gutterBottom paddingTop={2}>
            News Entry Form
          </Typography>

          <TextField
            label="Title"
            variant="outlined"
            name="title"
            value={formValues.title}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            multiline
            rows={3}
          />

          {/* Categories */}
          <FormControl fullWidth margin="normal" required>
            <FormLabel component="legend">Category</FormLabel>
            <Select value={formValues.category} onChange={handleChange} name="category" displayEmpty>
              <MenuItem value="" disabled>
                Select Category
              </MenuItem>
              {/* slicing pages to avoid 'home' becoming a category */}
              {pages.slice(1).map((category, index) => (
                <MenuItem key={index} value={category.english}>
                  {category.malayalam}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Reporter Name"
            variant="outlined"
            name="reporterName"
            value={formValues.reporterName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <Typography variant="subtitle1" component="div" sx={{ color: 'info.main' }}>↓ Add &apos; <span style={{color: 'red'}} >main</span> &apos; tag to display as main news</Typography>

          <TextField
            label="Tags (comma separated) "
            variant="outlined"
            name="tags"
            value={formValues.tags}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />



          {/* Dynamic Fields for Headings and Descriptions */}
          {Array.from({ length: 5 }).map((_, index) => (
            <React.Fragment key={index}>

              {/* Render additional label if text exists in the additionalLabels array */}
              {additionalLabels[index] && (
                <Typography variant="subtitle1" gutterBottom sx={{ color: 'warning.main' }}>
                  {additionalLabels[index]}
                </Typography>
              )}


              <TextField
                label={`Sub-heading ${index + 1}`}
                variant="outlined"
                name={`heading${index + 1}`}
                value={formValues[`heading${index + 1}`]}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                rows={3}
              />
              <Typography variant="subtitle1" component="div" sx={{ color: '#bdbdbd' }}>↓ pressing &apos;enter&apos; starts a new line</Typography>
              <TextField
                label={`Paragraph ${index + 1}`}
                variant="outlined"
                name={`description${index + 1}`}
                value={formValues[`description${index + 1}`]}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                rows={8}
              />
            </React.Fragment>
          ))}

          <TextField
            label="External Link"
            variant="outlined"
            name="link"
            value={formValues.link}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />


          {/* Main Image or Image No 1 */}
          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend" sx={{ fontWeight: '500', marginBottom: '.5rem', color: '#181818' }}>Main Image (required) </FormLabel>
            <FormLabel component="legend" sx={{ color: 'success.main' }}>ⓘ (Preferred Aspect Ratio: 16/9) </FormLabel>

            <>
              {imagePreview && (
                <>
                  <Image src={imagePreview} alt="Preview" width={100} height={100} layout='responsive' style={{ maxHeight: 100, width: 'auto', margin: '10px 0' }} />
                  <Typography variant="body2">{formValues.imageFile && formValues.imageFile.name}</Typography>
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
          <TextField
            label="Image Credit / Description"
            variant="outlined"
            name="imageCredit"
            value={formValues.imageCredit}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <hr />

          {/* Image No 2 */}
          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend" sx={{ fontWeight: '500', marginBottom: '.5rem', color: '#181818' }}>Image 2  (optional)  </FormLabel>
            <FormLabel component="legend">ⓘ (Preferred Aspect Ratio: 16/9) </FormLabel>

            <>
              {imagePreview1 && (
                <>
                  <Image src={imagePreview1} alt="Preview" width={100} height={100} layout='responsive' style={{ maxHeight: 100, width: 'auto', margin: '10px 0' }} />
                  <Typography variant="body2">{formValues.imageFile1 && formValues.imageFile1.name}</Typography>
                  <Button variant="contained" color="warning" onClick={() => handleCancel('imageUrl1')} style={{ marginTop: '10px', marginBottom: '10px' }}>
                    Cancel Upload
                  </Button>
                </>
              )}
              <Button variant="contained" component="label">
                Upload Image
                <input type="file" hidden name="imageFile1" onChange={handleChange} accept="image/*" />
              </Button>
            </>

          </FormControl>
          <TextField
            label="Image Credit / Description"
            variant="outlined"
            name="imageCredit1"
            value={formValues.imageCredit1}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <hr />

          {/* Image 3 */}
          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend" sx={{ fontWeight: '500', marginBottom: '.5rem', color: '#181818' }}>Image 3 (optional) </FormLabel>
            <FormLabel component="legend">ⓘ (Preferred Aspect Ratio: 16/9) </FormLabel>

            <>
              {imagePreview2 && (
                <>
                  <Image src={imagePreview2} alt="Preview" width={100} height={100} layout='responsive' style={{ maxHeight: 100, width: 'auto', margin: '10px 0' }} />
                  <Typography variant="body2">{formValues.imageFile2 && formValues.imageFile2.name}</Typography>
                  <Button variant="contained" color="warning" onClick={() => handleCancel('imageUrl2')} style={{ marginTop: '10px', marginBottom: '10px' }}>
                    Cancel Upload
                  </Button>
                </>
              )}
              <Button variant="contained" component="label">
                Upload Image
                <input type="file" hidden name="imageFile2" onChange={handleChange} accept="image/*" />
              </Button>
            </>

          </FormControl>
          <TextField
            label="Image Credit / Description"
            variant="outlined"
            name="imageCredit2"
            value={formValues.imageCredit2}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <hr />
          {/* Image 4 */}
          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend" sx={{ fontWeight: '500', marginBottom: '.5rem', color: '#181818' }}>Image 4  (optional)  </FormLabel>
            <FormLabel component="legend">ⓘ (Preferred Aspect Ratio: 16/9) </FormLabel>

            <>
              {imagePreview3 && (
                <>
                  <Image src={imagePreview3} alt="Preview" width={100} height={100} layout='responsive' style={{ maxHeight: 100, width: 'auto', margin: '10px 0' }} />
                  <Typography variant="body2">{formValues.imageFile3 && formValues.imageFile3.name}</Typography>
                  <Button variant="contained" color="warning" onClick={() => handleCancel('imageUrl3')} style={{ marginTop: '10px', marginBottom: '10px' }}>
                    Cancel Upload
                  </Button>
                </>
              )}
              <Button variant="contained" component="label">
                Upload Image
                <input type="file" hidden name="imageFile3" onChange={handleChange} accept="image/*" />
              </Button>
            </>

          </FormControl>
          <TextField
            label="Image Credit / Description"
            variant="outlined"
            name="imageCredit3"
            value={formValues.imageCredit3}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />




          {/* YouTube Video URL */}
          <TextField
            label="YouTube Video URL"
            variant="outlined"
            name="youtubeUrl"
            value={formValues.youtubeUrl}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ sx: { fontWeight: 400, color: '#181818' } }}
          />
          {/* Display YouTube preview */}
          {youtubePreview && formValues.youtubeUrl && (
            <div style={{ maxWidth: '400px', maxHeight: '315px', margin: '10px 0' }}>
              <iframe src={youtubePreview} title="YouTube Video Preview" frameBorder="0" allowFullScreen style={{ width: '100%', height: '100%' }}></iframe>
            </div>
          )}

          <TextField
            label="YouTube Credit / Description "
            variant="outlined"
            name="youtubeCredit"
            value={formValues.youtubeCredit}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          {/* Instagram URL input field */}
          <TextField
            label="Instagram Video URL"
            variant="outlined"
            name="instagramUrl"
            value={formValues.instagramUrl}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ sx: { color: '#181818' } }}
          />

          {/* Display Instagram preview */}
          {instagramPreview && formValues.instagramUrl && (
            <div style={{ maxWidth: '250px', maxHeight: '350px' }}>
              <iframe src={instagramPreview} width="100%" height="100%" frameborder="0" scrolling="no" allowtransparency="true"></iframe>
            </div>
          )}


          <TextField
            label="Instagram Credit / Description"
            variant="outlined"
            name="instagramCredit"
            value={formValues.instagramCredit}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          {/* Upload Video */}
          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend" sx={{ fontWeight: '500', marginBottom: '.5rem', color: '#181818' }}>Upload Video </FormLabel>
            <FormLabel component="legend"> <span style={{ color: 'red' }}>⚠ Warning: </span> Uploading video uses relatively large server space. ( required file format: mp4)</FormLabel>
            <>
              {videoPreview && (
                <>
                  <video src={videoPreview} controls style={{ height: 100, width: 'auto', margin: '10px 0' }} />
                  <Typography variant="body2">{formValues.videoFile && formValues.videoFile.name}</Typography>
                  <Button variant="contained" color="warning" onClick={() => handleCancel('videoUrl')} style={{ marginTop: '10px', marginBottom: '10px' }}>
                    Cancel Upload
                  </Button>
                </>
              )}
              <Button variant="contained" component="label">
                Upload Video
                <input type="file" hidden name="videoFile" onChange={handleChange} accept="video/*" />
              </Button>
            </>

          </FormControl>
          <TextField
            label="Video Credit / Description"
            variant="outlined"
            name="videoCredit"
            value={formValues.videoCredit}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />



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

        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
};

export default NewsForm;