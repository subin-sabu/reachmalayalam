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
  Snackbar,
  Alert,
  Select,
  MenuItem,
  Container,
} from '@mui/material';
import {  doc,  getDoc, updateDoc } from 'firebase/firestore';
import {  ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../lib/firebase'; //  db is initialized in this config file
import Resizer from 'react-image-file-resizer';
import { NewsContext } from '../../contexts/NewsContext';
import pages from '../Navbar/Categories';//for categories
import Image from 'next/image';
const uuidv4 = require('uuid').v4; // Import uuidv4 library


const EditForm = ({id}) => {

  // Scrolls to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  //States for Fetching data with id
  
  const {news} = useContext(NewsContext);
  const newsArray = news;
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
      const docRef = (db, 'news', newsId);
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
    category: '',
    reporterName: '',
    tags: '',
    imageFile: null,
    imageUrl: '',
    imagePath: '',
    imageCredit: '',
    imageFile1: null,
    imageUrl1: '',
    imagePath1: '',
    imageCredit1: '',
    thumbnailUrl: '',
    thumbnailPath: '',
    imageFile2: null,
    imageUrl2: '',
    imagePath2: '',
    imageCredit2: '',
    imageFile3: null,
    imageUrl3: '',
    imagePath3: '',
    imageCredit3: '',
    youtubeUrl: '',
    youtubeCredit: '',
    videoFile: null,
    videoUrl: '',
    videoPath: '',
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


  useEffect(() => {
    if (newsItem) {
      setFormValues({
        title: newsItem.title || '',
        category: newsItem.category || '',
        reporterName: newsItem.reporterName || '',
        tags: Array.isArray(newsItem.tags) ? newsItem.tags.join(', ') : newsItem.tags || '',
        imageFile: null,
        imageUrl: newsItem.imageUrl || '',
        imagePath: newsItem.imagePath || '',
        thumbnailUrl: newsItem.thumbnailUrl || '',
        thumbnailPath: newsItem.thumbnailPath || '',
        imageCredit: newsItem.imageCredit || '',
        imageFile1: null,
        imageUrl1: newsItem.imageUrl1 || '',
        imagePath1: newsItem.imagePath1 || '',
        imageCredit1: newsItem.imageCredit1 || '',
        imageFile2: null,
        imageUrl2: newsItem.imageUrl2 || '',
        imagePath2: newsItem.imagePath2 || '',
        imageCredit2: newsItem.imageCredit2 || '',
        imageFile3: null,
        imageUrl3: newsItem.imageUrl3 || '',
        imagePath3: newsItem.imagePath3 || '',
        imageCredit3: newsItem.imageCredit3 || '',
        youtubeUrl: newsItem.youtubeUrl || '',
        youtubeCredit: newsItem.youtubeCredit || '',
        videoFile: null,
        videoUrl: newsItem.videoUrl || '',
        videoPath: newsItem.videoPath || '',
        videoCredit: newsItem.videoCredit || '',
        instagramUrl: newsItem.instagramUrl || '',
        instagramCredit: newsItem.instagramCredit || '',
        description1: newsItem.description1 || '',
        heading1: newsItem.heading1 || '',
        description2: newsItem.description2 || '',
        heading2: newsItem.heading2 || '',
        description3: newsItem.description3 || '',
        heading3: newsItem.heading3 || '',
        description4: newsItem.description4 || '',
        heading4: newsItem.heading4 || '',
        description5: newsItem.description5 || '',
        heading5: newsItem.heading5 || '',
        link: newsItem.link || ''
      });
      // Set image previews if corresponding URLs have initial values
      if (newsItem.imageUrl) setImagePreview(newsItem.imageUrl);
      if (newsItem.imageUrl1) setImagePreview1(newsItem.imageUrl1);
      if (newsItem.imageUrl2) setImagePreview2(newsItem.imageUrl2);
      if (newsItem.imageUrl3) setImagePreview3(newsItem.imageUrl3);
      if (newsItem.videoUrl) setVideoPreview(newsItem.videoUrl);
      // youtube and instagram previews cannot be shown this way as YouTube and Instagram are blocking embedding their content in iframes due to their X-Frame-Options policy. This is a security feature implemented by websites to prevent clickjacking attacks, where a malicious site tries to embed another site's content in an iframe and trick users into interacting with it unknowingly.
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
        setFormValues(prev => ({ ...prev, imageFile: null, imageUrl: null, thumbnailUrl: null }));
        break;
      case 'imageUrl1':
        setImagePreview1('');
        setFormValues(prev => ({ ...prev, imageFile1: null, imageUrl1: null }));
        break;
      case 'imageUrl2':
        setImagePreview2('');
        setFormValues(prev => ({ ...prev, imageFile2: null, imageUrl2: null }));
        break;
      case 'imageUrl3':
        setImagePreview3('');
        setFormValues(prev => ({ ...prev, imageFile3: null, imageUrl3: null }));
        break;
      case 'videoUrl':
        setVideoPreview('');
        setFormValues(prev => ({
          ...prev, videoFile: null,
          videoUrl: null
        }));
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
      if (
        (formValues.imageUrl === null && formValues.imagePath) ||
        (formValues.imageUrl1 === null && formValues.imagePath1) ||
        (formValues.imageUrl2 === null && formValues.imagePath2) ||
        (formValues.imageUrl3 === null && formValues.imagePath3) ||
        (formValues.videoUrl === null && formValues.videoPath)
      ) {
        // Delete the corresponding files from Firebase Storage
        if (formValues.imageUrl === null && formValues.imagePath) {
          await deleteFile(formValues.imagePath);
          // Also delete the thumbnail
          await deleteFile(formValues.thumbnailPath);
        }
        if (formValues.imageUrl1 === null && formValues.imagePath1) {
          await deleteFile(formValues.imagePath1);
        }
        if (formValues.imageUrl2 === null && formValues.imagePath2) {
          await deleteFile(formValues.imagePath2);
        }
        if (formValues.imageUrl3 === null && formValues.imagePath3) {
          await deleteFile(formValues.imagePath3);
        }
        if (formValues.videoUrl === null && formValues.videoPath) {
          await deleteFile(formValues.videoPath);
        }
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
        thumbnailPath: null
      }));
    }
    if (formValues.imageUrl1 === null && formValues.imagePath1) {
      setFormValues(prev => ({
        ...prev,
        imagePath1: null
      }));
    }
    if (formValues.imageUrl2 === null && formValues.imagePath2) {
      setFormValues(prev => ({
        ...prev,
        imagePath2: null
      }));
    }
    if (formValues.imageUrl3 === null && formValues.imagePath3) {
      setFormValues(prev => ({
        ...prev,
        imagePath3: null
      }));
    }
    if (formValues.videoUrl === null && formValues.videoPath) {
      setFormValues(prev => ({
        ...prev,
        videoPath: null
      }));
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


    let thumbnailUrl = formValues.thumbnailUrl || null;
    let thumbnailPath = formValues.thumbnailPath || null;
    let imageUrl = formValues.imageUrl || null;
    let imagePath = formValues.imagePath || null;

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
    let imageUrl1 = formValues.imageUrl1 || null;
    let imagePath1 = formValues.imagePath1 || null;
    let imageUrl2 = formValues.imageUrl2 || null;
    let imagePath2 = formValues.imagePath2 || null;
    let imageUrl3 = formValues.imageUrl3 || null;
    let imagePath3 = formValues.imagePath3 || null;

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
    let videoUrl = formValues.videoUrl || null;
    let videoPath = formValues.videoPath || null;
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
      editedTime: new Date(),
      editorEmail: currentUser.email,
      timestamp: newsItem.timestamp,
      reporterEmail: newsItem.reporterEmail,
      tags: formValues.tags ? formValues.tags.split(',').map(tag => tag.trim()) : [],
      title: formValues.title || null,
      category: formValues.category || null,
      reporterName: formValues.reporterName || null,
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
      const docRef = doc(db, 'news', id);
      await updateDoc(docRef, newsData);
      setLoading(false);
      alert('News updated successfully');
      navigate('/admin/news-manager');

    } catch (error) {
      console.error('Error updating news: ', error);
      setLoading(false);
      alert('Error updating news. Please try again.\n' + error.message);

    }
  };

  //button go cancel and go back
  const cancelAndGoBack = () => {
    navigate('/admin/news-manager');
  };

  //button go redirect and refresh
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
            <span style={{ fontWeight: 500 }}>ⓘ Read Me:</span> Changes will be applied only if you submit the form.
          </Typography>
          <Typography variant="h6" gutterBottom paddingTop={2}>
            News Edit Form
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

          <Typography variant="subtitle1" component="div" sx={{ color: 'info.main' }}> ↓  Add &apos;<span style={{color: 'red'}} >main</span>&apos; tag to display as main news</Typography>


          <TextField
            label="Tags (comma separated)"
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
              <TextField
                label={`Paragraph ${index + 1}`}
                variant="outlined"
                name={`description${index + 1}`}
                value={formValues[`description${index + 1}`]}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                rows={9}
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
                  <Image src={imagePreview} alt="Preview" width={100} height={100} layout='responsive'
                  style={{ maxHeight: 100, width: 'auto', margin: '10px 0' }} />
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
            label="Image Credit"
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
            label="Image Credit"
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
            label="Image Credit"
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
            label="Image Credit"
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
            label="YouTube Credit"
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
            label="Instagram Credit"
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
            label="Video Credit"
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
            {/* Button to cancel and go back */}
            <Button variant="contained" color="success" onClick={cancelAndGoBack}>
              cancel & go back
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

export default EditForm;