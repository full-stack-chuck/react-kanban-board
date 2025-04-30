import React from "react";
import { Modal, Box, Typography } from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 400 },
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

function CustomModal({ open, onClose, title, children, maxWidth, ...props }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      {...props}
    >
      <Box sx={{ ...modalStyle, width: maxWidth || modalStyle.width }}>
        {title && (
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            sx={{ mb: 3 }}
          >
            {title}
          </Typography>
        )}
        {children}
      </Box>
    </Modal>
  );
}

export default CustomModal;
