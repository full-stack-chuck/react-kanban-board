import React from "react";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  Drawer,
} from "@mui/material";

import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { logout } from "../store/authSlice";

const sideMenu = [
  { text: "Projects", icon: <AssignmentIcon /> },
  { text: "Logout", icon: <LogoutIcon /> },
];

function SideNav() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleNavigation = (path) => {
    if (path === "/logout") {
      handleLogout();
    } else {
      navigate(path);
    }
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          fontSize: "1.5rem",
          color: "#555555",
          padding: 2,
        }}
      >
        Stay-Sharp Kanban
      </Typography>

      <List>
        {sideMenu.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(`/${item.text.toLowerCase()}`)}
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                padding: "10px 15px",
                color:
                  location.pathname === `/${item.text.toLowerCase()}`
                    ? "#007BFF"
                    : "#555555",
                justifyContent: "flex-start",
                textAlign: "left",
                fontSize: "1.2rem",
                transition: "color 0.3s",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
              }}
            >
              <Box sx={{ marginRight: "15px" }}>{item.icon}</Box>

              {item.text}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />
    </Box>
  );

  return (
    <div>
      <Drawer
        variant="permanent"
        open={true}
        sx={{
          width: 250,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 250,
            boxSizing: "border-box",
            backgroundColor: "white",
          },
        }}
      >
        {DrawerList}
      </Drawer>
    </div>
  );
}

export default SideNav;
