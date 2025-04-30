import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import React from "react";

const StyledHeader = styled(Typography)(({ theme }) => ({
  fontSize: "1.25rem",
  fontWeight: "bold",
  color: "#555555",
  textAlign: "center",
  marginBottom: theme.spacing(2),
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  fontFamily: "Raleway",
}));

const CustomHeader = ({ title, subtitle }) => {
  return (
    <Box textAlign="center" mb={4}>
      <StyledHeader>{title}</StyledHeader>
      {subtitle && (
        <Typography variant="body1" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default CustomHeader;
