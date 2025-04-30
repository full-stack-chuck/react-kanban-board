import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import CustomBreadcrumbs from "../../components/CustomBreadcrumbs";

import CustomButton from "../../components/CustomButton";
import AddIcon from "@mui/icons-material/Add";
import ProjectForm from "./components/ProjectForm";
import ProjectTable from "./components/ProjectTable";

import { fetchProjects, clearSingleProject } from "../../store/projectSlice";
import { useDispatch } from "react-redux";


function ProjectDashboard() {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() =>{
    dispatch(fetchProjects())
  },[dispatch])

  const handleOpenModal = () => {
    setIsModalOpen(true);
    dispatch(clearSingleProject());
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenEditModal = () => {
    setIsModalOpen(true);
  };

  const theme = createTheme({
    typography: {
      allVariants: {
        color: "#555555",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, minHeight: "100vh", margin: 0, padding: 2 }}>
        <CssBaseline />

        <Box sx={{ padding: "20px", width: "100%" }}>
          <CustomBreadcrumbs />
        </Box>

        <Toolbar />
        <CustomButton
          label="Create Project"
          onClick={handleOpenModal}
          startIcon={<AddIcon />}
        />
        <hr />

        <ProjectForm open={isModalOpen} onClose={handleCloseModal} />
        <ProjectTable handleOpenEditModal={handleOpenEditModal} />

      </Box>
    </ThemeProvider>
  );
}

export default ProjectDashboard;
