import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import App from "./App";
import "./index.css";

// Material UI theme: dark mode + our amber brand color (same as --accent in index.css).
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#ffb020" },
  },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
