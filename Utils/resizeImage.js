// Utils/resizeImage.js

import Resizer from 'react-image-file-resizer';

const resizeImage = (
  file,
  maxWidth = 1000,
  maxHeight = 1000,
  compressFormat = "JPEG",
  quality = 90,
  rotation = 0,
) => {
  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      maxWidth,
      maxHeight,
      compressFormat,
      quality,
      rotation,
      (uri) => {
        resolve(uri);
      },
      'file'
    );
  });
};

export default resizeImage;
