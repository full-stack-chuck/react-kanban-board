import React, { useEffect, useState } from "react";
import { Box, Modal, Typography, TextField } from "@mui/material";
import CustomButton from "../../../components/CustomButton";

import { projectService } from "../../../services/projectService";
import { notify } from "../../../utils/toastNotifications";

import { useSelector, useDispatch } from "react-redux";
import { fetchProjects } from "../../../store/projectSlice";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

function ProjectForm({ open, onClose }) {
  const { project } = useSelector((state) => state.project);

  const projectId = project._id;

  const [projectData, setProjectData] = useState(project);

  const dispatch = useDispatch();

  useEffect(() => {
    if (project) {
      setProjectData(project);
    }
  }, [project]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { projectName, coreTechnology, projectDescription } = projectData;

  const onChange = (event) => {
    setProjectData({
      ...projectData,
      [event.target.name]: event.target.value,
    });
  };

  const onSubmitProject = async (event) => {
    event.preventDefault();

    if (!projectName || !projectDescription) {
      notify.error("Project Name and Project Description are required fields");
      return;
    }

    try {
      setLoading(true);
      let res;

      if (projectId) {
        res = await projectService.updateProject(projectId, projectData);
      } else {
        res = await projectService.createProject(projectData);
      }

      dispatch(fetchProjects());
      notify.success(res.data.message);
      onClose();
    } catch (error) {
      notify.error(error.response?.data?.message || "Unable to create project");
      setError(error.response?.data?.message || "Unable to create project");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="project-modal-title"
      aria-describedby="project-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography
          id="project-modal-title"
          variant="h6"
          component="h2"
          sx={{ mb: 3 }}
        >
          {projectId ? "Edit Project" : "Create New Project"}
        </Typography>

        <form onSubmit={onSubmitProject}>
          <TextField
            margin="normal"
            fullWidth
            id="projectName"
            label="Project Name"
            name="projectName"
            value={projectName}
            onChange={onChange}
            helperText="Required Field"
            autoFocus
          />

          <TextField
            margin="normal"
            fullWidth
            id="coreTechnology"
            label="Core Technology"
            name="coreTechnology"
            value={coreTechnology}
            onChange={onChange}
            helperText="i.e. React, Spring Boot, Java, ExpressJS, etc."
          />

          <TextField
            margin="normal"
            fullWidth
            id="projectDescription"
            label="Project Description"
            name="projectDescription"
            value={projectDescription}
            onChange={onChange}
            multiline
            rows={4}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 3,
            }}
          >
            <CustomButton
              label="Cancel"
              onClick={onClose}
              variant="outlined"
              sx={{
                width: "100px",
                fontSize: "14px",
              }}
            />

            <CustomButton
              label="Save"
              type="submit"
              //   disabled={loading}
              sx={{
                width: "100px",
                fontSize: "14px",
              }}
            />
          </Box>
        </form>
      </Box>
    </Modal>
  );
}

export default ProjectForm;
