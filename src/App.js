import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const onFileUpload = async () => {
    if (!selectedFile) {
      alert('Please select a PDF file first.');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', selectedFile);

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/upload', formData, {
        responseType: 'blob', // Ensure we receive the file as a blob
      });

      // Create a download link for the Excel file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'tables.xlsx'); // File name
      document.body.appendChild(link);
      link.click();
      link.remove();

      setLoading(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>PDF to Excel Converter</h1>
      <input type="file" onChange={onFileChange} accept="application/pdf" />
      <button onClick={onFileUpload} disabled={loading}>
        {loading ? 'Processing...' : 'Upload and Convert'}
      </button>
    </div>
  );
}

export default App;
