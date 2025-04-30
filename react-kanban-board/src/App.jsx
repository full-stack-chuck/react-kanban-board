import { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes";
import { Toaster } from "react-hot-toast";

import SideNav from "./components/SideNav";
import { useSelector } from "react-redux";

import { Box } from "@mui/material";

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Router>
      <Box sx={{ display: "flex", width: "100%" }}>
        <Toaster />
        {isAuthenticated && (
          <>
            <Box
              component="nav"
              sx={{
                width: 100,
                flexShrink: 0,
                display: { xs: "none", sm: "block" },
              }}
            >
              <SideNav />
            </Box>
          </>
        )}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { xs: "100%", sm: `calc(100% - 240px)` },
            ml: { sm: !isAuthenticated ? 0 : "240px" },
          }}
        >

          <AppRoutes />

        </Box>
        
      </Box>
    </Router>
  );
}

export default App;
