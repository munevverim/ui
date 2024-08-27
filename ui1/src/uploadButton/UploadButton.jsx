import React from 'react';
import styles from './UploadButton.module.css';

const UploadButton = ({ onImageUpload }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          onImageUpload(reader.result);
        };
        reader.readAsDataURL(file);
      }

      e.target.value = '';
  };

  return (
    <div>
      <input
        type="file"
        accept=".jpg, .jpeg, .png"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="upload-input"
      />
      <label htmlFor="upload-input" className={styles.uploadButton}>
        Upload Image
      </label>
    </div>
  );
};

export default UploadButton;