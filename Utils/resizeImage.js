import Resizer from 'react-image-file-resizer';

const resizeImage = (file, maxWidth, maxHeight) => {
  return new Promise((resolve, reject) => {
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
      'file'
    );
  });
};

export default resizeImage;
