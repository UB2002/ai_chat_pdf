import React, { useState, useRef, useEffect } from "react";
import { Box, Button, TextField, Typography, Avatar } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import logo from "../assets/logo.png";

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [qaPairs, setQaPairs] = useState([]);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const handleAsk = async () => {
    if (!question.trim()) return;

    const newQuestion = question;
    setQuestion("");

    setQaPairs((prev) => [...prev, { question: newQuestion, answer: "", pending: true }]);

    try {
      const res = await axios.post(
        "http://localhost:8000/ask",
        { question: newQuestion },
        { headers: { "Content-Type": "application/json" } }
      );
      const answer = res.data.answer || "No answer provided";

      setQaPairs((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { question: newQuestion, answer, pending: false };
        return updated;
      });
    } catch (error) {
      console.error("Error asking question:", error);
      setQaPairs((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          question: newQuestion,
          answer: "Sorry, I couldn't process your question. Please try again.",
          error: true,
          pending: false,
        };
        return updated;
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [qaPairs]);

  useEffect(() => {
    const updateChatHeight = () => {
      if (chatContainerRef.current) {
        const navHeight = document.querySelector("header")?.offsetHeight || 64;
        const inputHeight = document.querySelector("form")?.offsetHeight || 80;
        const windowHeight = window.innerHeight;
        const availableHeight = windowHeight - navHeight - inputHeight;
        chatContainerRef.current.style.height = `${availableHeight}px`;
      }
    };
    updateChatHeight();
    window.addEventListener("resize", updateChatHeight);
    return () => window.removeEventListener("resize", updateChatHeight);
  }, []);

  return (
    <>
      <Box
        ref={chatContainerRef}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          px: { xs: 1, sm: 2 },
          py: { xs: 1, sm: 2 },
          overflowY: "auto",
          "&::-webkit-scrollbar": { width: "8px" },
          "&::-webkit-scrollbar-track": { backgroundColor: "#f5f5f5", borderRadius: "4px" },
          "&::-webkit-scrollbar-thumb": { backgroundColor: "#bdbdbd", borderRadius: "4px", "&:hover": { backgroundColor: "#9e9e9e" } },
        }}
      >
        {qaPairs.length === 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", opacity: 0.7 }}>
            <Typography variant="h6" color="text.secondary">No conversations yet</Typography>
            <Typography variant="body2" color="text.secondary">Ask a question to get started</Typography>
          </Box>
        ) : (
          qaPairs.map((pair, index) => (
            <Box key={index} sx={{ mb: 4 }}>
              {/* Question */}
              <Box sx={{ display: "flex", mb: 3 }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: "#B39DDB", fontSize: 14, mr: 2 }}>S</Avatar>
                <Box sx={{ maxWidth: { xs: "100%", sm: "75%" }, p: 1.5 }}>
                  <Typography variant="body1">{pair.question}</Typography>
                </Box>
              </Box>
              {/* Answer */}
              <Box sx={{ display: "flex" }}>
                <Avatar src={logo} alt="Planet AI" sx={{ width: 36, height: 36, mr: 2 }} />
                <Box sx={{ maxWidth: { xs: "100%", sm: "75%" }, p: 1.5 }}>
                  {pair.pending ? (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>Thinking...</Typography>
                  ) : (
                    <Typography variant="body1" sx={{ color: pair.error ? "error.main" : "text.primary", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                      {pair.answer}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Box
        component="form"
        onSubmit={(e) => { e.preventDefault(); handleAsk(); }}
        sx={{ px: { xs: 1, sm: 5 }, py: 2 }}
      >
        <TextField
          fullWidth
          placeholder="Ask a question..."
          variant="outlined"
          size="medium"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={handleKeyPress}
          InputProps={{
            endAdornment: (
              <Button
                type="submit"
                variant="contained"
                disableElevation
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
                startIcon={<SendIcon />}
              >
                Send
              </Button>
            ),
          }}
        />
      </Box>
    </>
  );
}
