import { Box, Typography, Button } from "@mui/material";
import FileIcon from "@mui/icons-material/InsertDriveFile";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import logo from "../assets/logo.png";
import { useState } from "react";
import axios from "axios";

function NavBar() {
  const [currentFile, setCurrentFile] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response.data.message || "File uploaded successfully");
      setCurrentFile(file.name);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleUploadClick = () => {
    document.getElementById("file-upload-input").click();
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        padding: 2,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        boxShadow: "1px 2px 8px rgba(151, 148, 148, 0.3)",
        zIndex: 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box component="img" src={logo} alt="Planet Logo" sx={{ height: 50, mr: 1 }} />
        <Box>
          <Typography
            variant="h6"
            color="text.primary"
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 800,
              lineHeight: 1.1,
            }}
          >
            planet
          </Typography>
          <Typography variant="caption" sx={{ lineHeight: 1, marginLeft: 1 }}>
            formerly{" "}
            <Box component="span" sx={{ color: "#0FA958" }}>
              DPhi
            </Box>
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        {currentFile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              px: 2,
              py: 1,
              borderBottom: "1px solid #EAEAEA",
            }}
          >
            <FileIcon sx={{ color: "#0FA958", mr: 1, fontSize: 20 }} />
            <Typography variant="body2" color="text.secondary">
              {currentFile}
            </Typography>
          </Box>
        )}
        <input
          type="file"
          id="file-upload-input"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <Button
          variant="contained"
          onClick={handleUploadClick}
          startIcon={<UploadFileIcon sx={{ color: "black" }} />}
          sx={{
            backgroundColor: "#FFFFFF",
            color: "black",
            border: "1px solid black",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#f5f5f5",
              color: "black",
              border: "1px solid black",
              boxShadow: "none",
            },
          }}
        >
          Upload File
        </Button>
      </Box>
    </Box>
  );
}

export default NavBar;
