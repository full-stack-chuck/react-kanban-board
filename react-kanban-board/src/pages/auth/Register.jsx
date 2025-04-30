import { Box, Card, CardContent, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import CustomHeader from "../../components/CustomHeader";
import CustomButton from "../../components/CustomButton";
import { notify } from "../../utils/toastNotifications.jsx";
import { authService } from "../../services/authService";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import GoogleIcon from "../../assets/icons/google-logo.5867462c.svg";

import { useNavigate } from "react-router";

function Register() {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { continueWithGoogle } = useGoogleAuth();

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const { name, email, password, confirmPassword } = newUser;

  const navigate = useNavigate();

  const onChange = (event) => {
    setNewUser({
      ...newUser,
      [event.target.name]: event.target.value,
    });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      notify.error("All fields are required");

      return;
    }

    if (password !== confirmPassword) {
      notify.error("Your passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await authService.register(newUser);
      notify.success("Registration Successful");
      navigate("/login");
    } catch (error) {
      notify.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: "90%", md: "500px" },
          maxWidth: "600px",
        }}
      >
        <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 1 }}>
          <CardContent sx={{ padding: 3 }}>
            <Box textAlign="center" mb={4}>
              <CustomHeader
                title="Stay-Sharp Kanban"
                subtitle="Sign up to continue"
              />
            </Box>

            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              name="name"
              value={name}
              onChange={onChange}
            />

            <TextField
              label="Email Address"
              variant="outlined"
              type="email"
              fullWidth
              sx={{ mb: 2 }}
              name="email"
              value={email}
              onChange={onChange}
            />

            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              sx={{ mb: 2 }}
              name="password"
              value={password}
              onChange={onChange}
            />

            <TextField
              label="Confirm Password"
              variant="outlined"
              type="password"
              fullWidth
              sx={{ mb: 3 }}
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <CustomButton
                label="Sign Up"
                fullWidth
                onClick={onSubmit}
                sx={{
                  width: "500px",
                  mt: 3,
                  mb: 2,
                }}
              />
            </Box>

            <Typography
              variant="body2"
              sx={{ color: "gray", textAlign: "center", mb: 2 }}
            >
              Or continue with:
            </Typography>

            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={1}
            >
              <CustomButton
                label="Google"
                variant="outlined"
                fullWidth
                onClick={continueWithGoogle}
                startIcon={
                  <img
                    src={GoogleIcon}
                    alt="Google"
                    style={{ width: "23px" }}
                  />
                }
                sx={{
                  color: "#555555",
                  borderColor: "#cccccc",
                  width: "100%",
                  marginBottom: "0",
                  justifyContent: "flex-center",
                  display: "flex",
                }}
              />
            </Box>

            <Box display="flex" justifyContent="center" mt={3} gap={2}>
              <Typography
                onClick={() => navigate("/login")}
                variant="body2"
                sx={{
                  cursor: "pointer",
                  color: "#0052CC",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Already have an account? Log in
              </Typography>
            </Box>

            <Box display="flex" justifyContent="center" mt={3} gap={2}>
              <Typography
                onClick={() => navigate("/")}
                variant="body2"
                sx={{
                  cursor: "pointer",
                  color: "#0052CC",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Want to head back to the landing page? click here
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default Register;
