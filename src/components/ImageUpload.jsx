import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { uploadImage } from '../services/storageService';
import './ImageUpload.css';

const ImageUpload = ({ currentImage, onImageUploaded, folder = 'images' }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [compressing, setCompressing] = useState(false);

  const compressImage = async (file) => {
    const options = {
      maxWidthOrHeight: 1200, 
      initialQuality: 0.65, 
      useWebWorker: true, 
      fileType: file.type, 
    };

    try {
      const compressedFile = await imageCompression(file, options);
      console.log('Оригинален размер:', (file.size / 1024 / 1024).toFixed(2), 'MB');
      console.log('Компресиран размер:', (compressedFile.size / 1024 / 1024).toFixed(2), 'MB');
      return compressedFile;
    } catch (error) {
      console.error('Грешка при компресиране:', error);
      return file;
    }
  };

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);
    setCompressing(true);
    setError(null);

    try {
      // Компресирай изображението преди качване
      const compressedFile = await compressImage(file);
      setCompressing(false);
      
      // Качи компресираното изображение
      const imageUrl = await uploadImage(compressedFile, folder);
      onImageUploaded(imageUrl);
    } catch (err) {
      setError(err.message || 'Грешка при качване на изображение');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      setCompressing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    disabled: uploading || compressing,
  });

  return (
    <div className="image-upload">
      {currentImage && (
        <div className="current-image">
          <img src={currentImage} alt="Current" />
        </div>
      )}
      
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''} ${uploading || compressing ? 'uploading' : ''}`}
      >
        <input {...getInputProps()} />
        {compressing ? (
          <p>Компресиране на изображение...</p>
        ) : uploading ? (
          <p>Качване...</p>
        ) : (
          <>
            <p>
              {isDragActive
                ? 'Пуснете изображението тук'
                : 'Плъзнете изображение тук или кликнете за избор'}
            </p>
            <p className="hint">PNG, JPG, GIF до 10MB (ще бъде компресирано автоматично)</p>
          </>
        )}
      </div>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ImageUpload;

