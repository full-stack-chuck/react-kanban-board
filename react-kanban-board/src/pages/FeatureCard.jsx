import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
        <Icon sx={{ fontSize: 48, mb: 2, color: "primary.main" }} />

        <Typography variant="h5" component="h3" gutterBottom>
          {title}
        </Typography>

        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default FeatureCard;
