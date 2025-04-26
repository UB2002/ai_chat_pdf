import React from "react";
import { Box } from "@mui/material";
import NavBar from "./components/NavBar";
import Chat from "./components/Chat";

function App() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", bgcolor: "#FFFFFF" }}>
      <NavBar />
      <Chat />
    </Box>
  );
}

export default App;
