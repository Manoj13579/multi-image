import React, { useState } from 'react';
import axios from 'axios';

const UploadMultipleImages = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  


  console.log('selectedFiles', selectedFiles);
  const MAX_FILE_SIZE = 1 * 1024 * 1024; // max file size to be uploaded set to 1 mb.

  // Handle file selection
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files); // Get the selected files as an array
  // if jpg allowed then jpeg allowed too. jpg is a subset of jpeg
    const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];
  
    // Validate each file. for in loop used(not for). for loop(array method) used to iterate overewFiles array. each file is a file
    for (const file of newFiles) {
      //includes is array method
      if (!allowedTypes.includes(file.type)) {
        alert(`Invalid file type: ${file.name}. Only JPEG, JPG, and PNG are allowed.`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert(`File ${file.name} is too large. File size should be less than 1 MB.`);
        return;
      }
    }
  
    // Add valid files to the selectedFiles state
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
  
    // Generate previews for valid files
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };
  
  

  // Handle form submission
  const handleUpload = async (event) => {
    event.preventDefault();
    if (selectedFiles.length === 0) {
      alert('Please select files to upload');
      return;
    }

    const formData = new FormData();
    // 'images' should match the field name in the backend
    selectedFiles.forEach((file) => formData.append('images', file)); 
console.log('formdata', formData);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/upload/upload-multiple-images`,
        formData
      );
      // response.data contains url in path as array. save url to database as array
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Upload Multiple Images</h1>

      {/* File Input */}
      <form onSubmit={handleUpload} style={styles.form}>
        <input
          type="file"
          multiple
          // only accept images
          accept="image"
          onChange={handleFileChange}
          style={styles.fileInput}
        />

        {/* Image Previews */}
        <div style={styles.previewContainer}>
          {previewImages.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Preview`}
              style={styles.previewImage}
            />
          ))}
        </div>

        {/* Upload Button */}
        <button type="submit" style={styles.button}>
          Upload
        </button>
      </form>
    </div>
  );
};

// CSS-in-JS Styles
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9f9f9',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
  },
  fileInput: {
    display: 'block',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '10px',
    cursor: 'pointer',
  },
  previewContainer: {
    display: 'flex',
    gap: '10px',
    overflowX: 'auto',
  },
  previewImage: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '5px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default UploadMultipleImages;