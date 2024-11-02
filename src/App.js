import React, { useState, useRef } from 'react';
import { Box, Button, TextField, Typography, Snackbar } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import axios from 'axios';

// FileUpload Component
const FileUpload = ({ onUpload }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  return (
    <Box>
      <Button
        variant="outlined"
        startIcon={<UploadFileIcon />}
        sx={{ color: 'black', borderColor: 'black' }}
        onClick={() => fileInputRef.current.click()}
      >
        Upload PDF
      </Button>
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />
    </Box>
  );
};

function App() {
  const [question, setQuestion] = useState('');
  const [qaPairs, setQaPairs] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleUploadMessage = (file) => {
    const formData = new FormData();
    formData.append('file', file);

    axios.post('http://127.0.0.1:8000/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      setSnackbarMessage(response.data.message);
      setOpenSnackbar(true);
    })
    .catch((error) => {
      console.error('Error uploading file:', error);
      alert('Error uploading file.');
    });
  };

  const handleAsk = async () => {
    if (!question) {
      alert("Please enter a question.");
      return;
    }

    try {
      const res = await axios.post('http://127.0.0.1:8000/ask/', { question }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setQaPairs((prevPairs) => [...prevPairs, { question, answer: res.data.answer }]);
      setQuestion('');
    } catch (error) {
      console.error('Error asking question:', error);
      alert('Error asking question');
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#333' }}>
      {/* Fixed Top Bar */}
      <Box sx={{ height: '60px', backgroundColor: '#1d1d1d', padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" color="white">planet</Typography>
        <FileUpload onUpload={handleUploadMessage} />
      </Box>

      {/* Scrollable Content Area */}
      <Box sx={{ flex: 1, overflowY: 'auto', padding: 2 }}>
        <Typography variant="body1" color="primary" sx={{ marginBottom: 2 }}>Questions and Answers:</Typography>
        {qaPairs.map((pair, index) => (
          <Box key={index} sx={{ marginBottom: 2 }}>
            <Typography variant="body2" color="secondary">Q: {pair.question}</Typography>
            <Typography variant="body2" color="primary">A: {pair.answer}</Typography>
          </Box>
        ))}
      </Box>

      {/* Fixed Input Box */}
      <Box sx={{ padding: 2, backgroundColor: '#fff', display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          placeholder="Ask a question..."
          variant="outlined"
          size="small"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <Button variant="contained" sx={{ marginLeft: 1 }} onClick={handleAsk}>Send</Button>
      </Box>

      {/* Snackbar for Success Messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={
          <Button color="inherit" onClick={handleCloseSnackbar}>
            Close
          </Button>
        }
      />
    </Box>
  );
}

export default App;
