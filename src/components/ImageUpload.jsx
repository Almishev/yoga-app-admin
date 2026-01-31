import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadImage } from '../services/storageService';
import './ImageUpload.css';

const ImageUpload = ({ currentImage, onImageUploaded, folder = 'images' }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);
    setError(null);

    try {
      const imageUrl = await uploadImage(file, folder);
      onImageUploaded(imageUrl);
    } catch (err) {
      setError(err.message || 'Грешка при качване на изображение');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    disabled: uploading,
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
        className={`dropzone ${isDragActive ? 'active' : ''} ${uploading ? 'uploading' : ''}`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <p>Качване...</p>
        ) : (
          <>
            <p>
              {isDragActive
                ? 'Пуснете изображението тук'
                : 'Плъзнете изображение тук или кликнете за избор'}
            </p>
            <p className="hint">PNG, JPG, GIF до 10MB</p>
          </>
        )}
      </div>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ImageUpload;

