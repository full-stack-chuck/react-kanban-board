import React, { useState } from "react";
import { Box, Card, CardContent, TextField, Typography } from "@mui/material";
import CustomHeader from "../../components/CustomHeader";
import CustomButton from "../../components/CustomButton";
import { useNavigate } from "react-router-dom";

import { authService } from "../../services/authService";
import { notify } from "../../utils/toastNotifications.jsx";
import { useDispatch } from "react-redux";
import { setAuth } from "../../store/authSlice";

import GoogleIcon from "../../assets/icons/google-logo.5867462c.svg";
import { useGoogleAuth } from "../../hooks/useGoogleAuth.jsx";

function Login() {
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const { email, password } = login;

  const navigate = useNavigate();

  const { continueWithGoogle } = useGoogleAuth();

  const dispatch = useDispatch();

  const onChange = (event) => {
    setLogin({
      ...login,
      [event.target.name]: event.target.value,
    });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      notify.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const res = await authService.login(login);
      notify.success("Login Successful");
      dispatch(setAuth(res.data.data));
      navigate("/projects");
    } catch (error) {
      notify.error(
        error.response?.data?.message || "Login failed. Please try again."
      );

      setError(
        error.response?.data?.message || "Login failed. Please try again."
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
                subtitle="Log in to continue"
              />
            </Box>

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

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <CustomButton
                label="Continue"
                fullWidth
                sx={{
                  width: "500px",
                  mt: 3,
                  mb: 2,
                }}
                onClick={onSubmit}
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
                
                onClick={continueWithGoogle}
              />
            </Box>

            <Box display="flex" justifyContent="center" mt={3} gap={2}>
              <Typography
                variant="body2"
                onClick={() => navigate("/register")}
                sx={{
                  cursor: "pointer",
                  color: "#0052CC",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                You don't have an account yet? Click here to create an account
              </Typography>
            </Box>

            <Box display="flex" justifyContent="center" mt={3} gap={2}>
              <Typography
                variant="body2"
                onClick={() => navigate("/")}
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

export default Login;
