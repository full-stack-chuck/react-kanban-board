import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  IconButton,
  Menu,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { ArrowBack, MoreVert } from "@mui/icons-material";

import React, { useState, useEffect } from "react";
import CustomBreadcrumbs from "../../components/CustomBreadcrumbs";
import CustomButton from "../../components/CustomButton";
import AddIcon from "@mui/icons-material/Add";

import { useNavigate } from "react-router-dom";
import CustomModal from "../../components/CustomModal";

import { taskBoardService } from "../../services/taskBoardService";

import { notify } from "../../utils/toastNotifications";
import { useParams } from "react-router-dom";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

function TaskBoard() {
  const navigate = useNavigate();
  const params = useParams();

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [taskData, setTaskData] = useState({
    _id: "",
    taskSummary: "",
    acceptanceCriteria: "",
    status: "",
  });

  const [projectInfo, setProjectInfo] = useState("");
  const [tasks, setTasks] = useState({});

  const [refresh, setRefresh] = useState(false);

  const [selectedTask, setSelectedTask] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await taskBoardService.getAlltasks(params.id);
        const backendTaskData = res.data.data.board;
        setTasks(backendTaskData);
        // console.log(backendTaskData);
        setProjectInfo(res.data.data.projectInfo);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [refresh, params.id]);

  const boardRefresh = () => {
    setRefresh(!refresh);
  };

  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
    setTaskData({
      _id: "",
      taskSummary: "",
      acceptanceCriteria: "",
      status: "",
    });
  };

  const onChange = (event) => {
    setTaskData({
      ...taskData,
      [event.target.name]: event.target.value,
    });
  };

  const onSubmitCreateTask = async (event) => {
    event.preventDefault();

    if (!taskData.taskSummary) {
      notify.error("Task Summary is a required field");
      return;
    }

    let status = taskData.status || "todo";

    delete taskData._id;

    try {
      setLoading(true);
      await taskBoardService.createTask({ ...taskData, status }, params.id);
      boardRefresh();
      handleCloseCreateModal();
    } catch (error) {
      notify.error(error.response?.data?.message || "Unable to create task");
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event, task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
    console.log("handleMenuClick function called ");
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTask(null);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await taskBoardService.deleteTask(
        selectedTask._id,
        selectedTask.status,
        params.id
      );
      boardRefresh();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.log(error);
      notify.error("Unable to delete the task at this time");
    } finally {
      handleMenuClose();
    }
  };

  const handleOpenUpdateModal = (task) => {
    setTaskData(task);
    setUpdateModalOpen(true);
    handleMenuClose();
  };

  const handleCloseUpdateModal = () => {
    setUpdateModalOpen(false);
  };

  const onUpdateSubmit = async (event) => {
    event.preventDefault();

    if (!taskData.taskSummary) {
      notify.error("Task Summary is a required field");
      return;
    }

    try {
      setLoading(true);
      await taskBoardService.updateTask(
        taskData._id,
        taskData.status,
        taskData,
        params.id
      );

      boardRefresh();
      clearFormFields();
      handleCloseUpdateModal();
    } catch (error) {
      notify.error(error.response?.data?.message || "Unable to update task");
    } finally {
      setLoading(false);
    }
  };

  const clearFormFields = () => {
    setTaskData({
      _id: "",
      taskSummary: "",
      acceptanceCriteria: "",
      status: "",
    });
  };

  const handleOnDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    const taskData = { ...tasks };

    if (source.droppableId === destination.droppableId) {
      const column = taskData[source.droppableId];
      const items = Array.from(column.tasks);
      const [reOrderItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reOrderItem);
      taskData[source.droppableId] = {
        ...column,
        tasks: items,
      };
    } else {
      const sourceColumn = taskData[source.droppableId];
      const destinationColumn = taskData[destination.droppableId];
      const sourceColumnItems = Array.from(sourceColumn.tasks);
      const destinationColumnItems = Array.from(destinationColumn.tasks);
      const [movedItem] = sourceColumnItems.splice(source.index, 1);
      destinationColumnItems.splice(destination.index, 0, movedItem);

      taskData[source.droppableId] = {
        ...sourceColumn,
        tasks: sourceColumnItems,
      };

      taskData[destination.droppableId] = {
        ...destinationColumn,
        tasks: destinationColumnItems,
      };
    }

    setTasks(taskData);

    try {

      await taskBoardService.taskBulkUpdateDragAndDrop({
        sourceColumn: source.droppableId,
        destColumn: destination.droppableId,
        sourceIndex: source.index,
        destIndex: destination.index,

      }, params.id);
      
      boardRefresh();
      
    } catch (error) {
       console.log(error);
    }
  };

  return (
    <Box sx={{ padding: "37px" }}>
      <CustomBreadcrumbs />

      {/* Header Section */}

      <Box
        sx={{
          backgroundColor: "white",
          p: 3,
          borderRadius: 2,
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: "text.primary",
                mb: 0.5,
              }}
            >
              {projectInfo.projectName}
            </Typography>

            <Typography variant="subtitle1" color="text.secondary">
              {projectInfo.projectDescription}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            <Box>
              <Typography variant="h6" color="primary">
                {tasks?.todo?.tasks?.length ?? 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                To Do
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" color="primary">
                {tasks?.inProgress?.tasks?.length ?? 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                In Progress
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" color="primary">
                {tasks?.done?.tasks?.length ?? 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Done
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6">
                {Object.values(tasks).reduce(
                  (acc, curr) => acc + curr.tasks.length,
                  0
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Tasks
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Action Bar */}

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <CustomButton
            label="Create Task"
            onClick={handleOpenCreateModal}
            startIcon={<AddIcon />}
            sx={{
              width: { xs: "100%", sm: "auto" },
              mb: { xs: 2, sm: 0 },
            }}
          />
        </Box>

        <CustomButton
          label="Go Back"
          onClick={() => navigate("/projects")}
          startIcon={<ArrowBack />}
          variant="outlined"
          sx={{
            width: { xs: "100%", sm: "auto" },
          }}
        />
      </Box>

      {/* Create Task Modal */}
      <CustomModal
        open={createModalOpen}
        onClose={handleCloseCreateModal}
        title="Create New Task"
      >
        <form onSubmit={onSubmitCreateTask}>
          <TextField
            margin="normal"
            fullWidth
            label="Task Summary"
            name="taskSummary"
            value={taskData.taskSummary}
            onChange={onChange}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Acceptance Criteria"
            name="acceptanceCriteria"
            value={taskData.acceptanceCriteria}
            onChange={onChange}
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={taskData.status}
              label="Status"
              onChange={onChange}
            >
              <MenuItem value="todo">To Do</MenuItem>
              <MenuItem value="inProgress">In Progress</MenuItem>
              <MenuItem value="done">Done</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <CustomButton
              label="Cancel"
              onClick={handleCloseCreateModal}
              variant="outlined"
            />

            <CustomButton label="Create Task" type="submit" loading={loading} />
          </Box>
        </form>
      </CustomModal>

      {/* Task Board */}

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(3, 1fr)",
            },
            gap: 2,
            width: "100%",
          }}
        >
          {Object.entries(tasks).map(([columnId, column]) => (
            <Box key={columnId}>
              <Card
                sx={{
                  backgroundColor: "#f0efed",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                  height: "100%",
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    {column.title} ({column.tasks?.length})
                  </Typography>

                  <Droppable droppableId={columnId}>
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{ minHeight: 100 }}
                      >
                        {column.tasks.map((task, index) => (
                          <Draggable
                            key={task._id}
                            draggableId={task._id}
                            index={index}
                          >
                            {(provided) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{
                                  mb: 2,
                                  backgroundColor: "white",
                                  "&:hover": {
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                                  },
                                }}
                              >
                                <CardContent>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Box sx={{ flexGrow: 1 }}>
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                      >
                                        Task ID: {task._id}
                                      </Typography>

                                      <Typography
                                        variant="subtitle1"
                                        sx={{ mt: 1 }}
                                      >
                                        {task.taskSummary}
                                      </Typography>
                                    </Box>
                                    <IconButton
                                      onClick={(event) =>
                                        handleMenuClick(event, task)
                                      }
                                      size="small"
                                    >
                                      <MoreVert />
                                    </IconButton>
                                  </Box>
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        ))}

                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </DragDropContext>

      {/* Task Menu */}

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
        <MenuItem onClick={() => handleOpenUpdateModal(selectedTask)}>
          {" "}
          View/Update
        </MenuItem>

        <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
          {" "}
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        slotProps={{
          sx: {
            width: "100%",
            maxWidth: "400px",
            borderRadius: 2,
          },
        }}
      >
        <DialogContent>
          <Typography>
            You are deleting the task "{selectedTask?.taskSummary}". This action
            cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <CustomButton
            label="Cancel"
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
          />

          <CustomButton
            label="Delete"
            onClick={handleDeleteConfirm}
            color="error"
          />
        </DialogActions>
      </Dialog>

      {/* Update Task Modal */}

      <CustomModal
        open={updateModalOpen}
        onClose={handleCloseUpdateModal}
        title="Update Task"
      >
        <form onSubmit={onUpdateSubmit}>
          <TextField
            margin="normal"
            fullWidth
            label="Task ID"
            value={taskData._id || ""}
            disabled
            sx={{ mb: 2 }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Task Summary"
            name="taskSummary"
            value={taskData.taskSummary || ""}
            onChange={onChange}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Acceptance Criteria"
            name="acceptanceCriteria"
            value={taskData.acceptanceCriteria || ""}
            onChange={onChange}
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={taskData.status || ""}
              label="Status"
              onChange={onChange}
            >
              <MenuItem value="todo">To Do</MenuItem>
              <MenuItem value="inProgress">In Progress</MenuItem>
              <MenuItem value="done">Done</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <CustomButton
              label="Cancel"
              onClick={handleCloseUpdateModal}
              variant="outlined"
            />

            <CustomButton label="Update Task" type="submit" loading={loading} />
          </Box>
        </form>
      </CustomModal>
    </Box>
  );
}

export default TaskBoard;
