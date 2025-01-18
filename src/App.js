import React, { useState, useRef } from 'react';
import { Box, Button, TextField, Typography, Snackbar } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import axios from 'axios';
import logo from './logo.png';
import SendIcon from '@mui/icons-material/Send';

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

    axios.post('https://ai-chat-pdf-test.onrender.com/upload/', formData, {
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
      const res = await axios.post('https://ai-chat-pdf-test.onrender.com/ask/', { question }, {
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
    
    

    // <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#333' }}>
    //   {/* Fixed Top Bar */}
    //   <Box sx={{ height: '60px', backgroundColor: 'white', padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    //   <img src={logo} alt="Logo" style={{ height: '40px' }} 
      
    //   />
    //     <Typography variant="h6" color="black">planet</Typography>
    //     <FileUpload onUpload={handleUploadMessage} />
    //   </Box>
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#333' }}>
    {/* Fixed Top Bar */}
    <Box sx={{ height: '40px', backgroundColor: 'white', padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' ,boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)', zIndex: 1}}>
      {/* Flex container for logo and title */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
    </Box>
      
      {/* File Upload Button */}
      <FileUpload onUpload={handleUploadMessage} />
    </Box>
       
{/* Content Area */}
<Box sx={{ backgroundColor: 'white', flex: 1, overflowY: 'auto', padding: 2 }}>
  <Typography variant="h5" color="black" sx={{ marginBottom: 3, fontWeight: 'bold' }}>
  </Typography>
  {qaPairs.map((pair, index) => (
    <Box
      key={index}
      sx={{
        marginBottom: 3,
        padding: 2,
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
        Q: {pair.question}
      </Typography>
      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
        {pair.answer}
      </Typography>
    </Box>
  ))}
</Box>

      

      {/* Fixed Input Box */}
      <Box sx={{background: 'white'}}>
        <Box sx={{ padding: 2, backgroundColor: 'white', display: 'flex', alignItems: 'center', marginBottom:'10px'}}>
        <TextField
          fullWidth
          placeholder="Ask a question..."
          variant="outlined"
          size="small"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}

          InputProps={{
            endAdornment: (
              <Button
              sx={{ color: 'black', justifyContent: 'right'}}
              startIcon={<SendIcon />}
                onClick={handleAsk}
              />
            ),
          }}

          
         
        />
        </Box>
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
