import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import boardsample from "../assets/images/boardsample.png";

import { features } from "./Features.jsx";
import FeatureCard from "./FeatureCard.jsx";

function Landing() {
  const navigate = useNavigate();

  return (
    <Box>
      <AppBar position="fixed" color="default" elevation={0}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
            Stay-Sharp Kanban Board
          </Typography>
          <Box>
            <Button
              onClick={() => navigate("/login")}
              variant="outlined"
              color="primary"
              sx={{ mr: 2 }}
            >
              Login
            </Button>
            <Button
              onClick={() => navigate("/register")}
              variant="contained"
              color="primary"
            >
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          pt: 15,
          pb: 8,
          background: "linear-gradient(45deg, #f3f4f6 30%, #ffffff 90%)",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={2} alignItems="center">
            <Grid size={6}>
              <Typography variant="h2" gutterBottom sx={{ fontWeight: "bold" }}>
                Organize Your Learning
                <br />
                <Box component="span" sx={{ color: "primary.main" }}>
                  and Solo Projects
                </Box>
              </Typography>
              <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
                Track your GROWTH with our Stay-Sharp Kanban tool. Perfect for
                individuals looking to keep track of their learning and solo
                projects
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button
                  onClick={() => navigate("/register")}
                  variant="contained"
                  size="large"
                  sx={{ mr: 2, px: 4, py: 1.5 }}
                >
                  Get Started Today
                </Button>
              </Box>
            </Grid>
            <Grid size={6}>
              <Box
                component="img"
                src={boardsample}
                alt="Kanban board preview"
                sx={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
            Why Choose Stay-Sharp Kanban?
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid size={4} key={index}>
                <FeatureCard {...feature} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default Landing;
