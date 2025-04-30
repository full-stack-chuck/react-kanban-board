import React, { useState } from "react";
import {
  Box,
  Paper,
  styled,
  Table,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  IconButton,
  Skeleton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import { useDispatch, useSelector } from "react-redux";

import { fetchProjects, setSingleProject } from "../../../store/projectSlice";
import { projectService } from "../../../services/projectService";
import { useNavigate } from "react-router-dom";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    fontWeight: 600,
    color: theme.palette.text.primary,
    borderBottom: `2px solid ${theme.palette.divider}`, // Slightly thicker bottom border for header
  },

  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },

  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },

  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function ProjectTable({ handleOpenEditModal }) {
  const { projects, loading } = useSelector((state) => state.project);

  const [selectedProject, setSelectedProject] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleMenuOpen = (event, project) => {
    setAnchorEl(event.currentTarget);
    setSelectedProject(project);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProject(null);
  };

  const handleDeleteMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleDeleteMenuClose();
  };

  const handleDeleteConfirm = async () => {
    try {
      // console.log(selectedProject);
      await projectService.deleteProject(selectedProject._id);

      dispatch(fetchProjects());

      setDeleteDialogOpen(false);
      handleMenuClose();
    } catch (error) {
      console.error("Error deleting project:", error);
      notify.error("Error deleting project:", error);
    }
  };

  const handleUpdateProject = () => {
    if (selectedProject) {
      dispatch(setSingleProject(selectedProject));
      handleOpenEditModal(true);
    }

    handleMenuClose();
  };

  const handleProjectBoard = () => {
    if (selectedProject) {
      navigate(`/projects/${selectedProject._id}/taskBoard`);
    }
    handleMenuClose();
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="rectangular" width="100%" height={400} />
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Project Name</StyledTableCell>

              <StyledTableCell>Core Technology</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell align="right">Actions</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {projects.map((project) => (
              <StyledTableRow key={project._id}>
                <StyledTableCell component="th" scope="row">
                  {project.projectName}
                </StyledTableCell>
                <StyledTableCell> {project.coreTechnology} </StyledTableCell>
                <StyledTableCell>
                  {" "}
                  {project.projectDescription}{" "}
                </StyledTableCell>
                <StyledTableCell align="right">
                  <IconButton
                    onClick={(event) => handleMenuOpen(event, project)}
                    size="small"
                  >
                    <MoreVert />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleProjectBoard}>Project Board</MenuItem>

        <MenuItem onClick={handleUpdateProject}>Update Project</MenuItem>

        <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
          Delete Project
        </MenuItem>
      </Menu>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            You are deleting project "{selectedProject?.projectName}" and all
            associated tasks. This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>

          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProjectTable;
