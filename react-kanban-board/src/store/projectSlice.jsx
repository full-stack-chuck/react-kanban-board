import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { projectService } from "../services/projectService";
import { notify } from "../utils/toastNotifications.jsx";

export const fetchProjects = createAsyncThunk(
  "project/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await projectService.getAllProjects();
      return response.data.data;
    } catch (error) {
      notify.error(
        error.response?.data?.message || "Unable to get project list"
      );

      return rejectWithValue(
        error.response?.data || "Failed to fetch projects"
      );
    }
  }
);

const projectSlice = createSlice({
  name: "project",

  initialState: {
    projects: [],
    project: { projectName: "", coreTechnology: "", projectDescription: "" },
    loading: false,
    error: null,
  },


  reducers: {
    setSingleProject: (state, action) => {
      state.project = action.payload;
    },

    clearSingleProject: (state) => {
      state.project = {
        projectName: "",
        coreTechnology: "",
        projectDescription: "",
      };
    },

  },

  extraReducers: (builder) => {
    builder
    .addCase(fetchProjects.pending, (state) =>{
        state.loading = true;
        state.error = null;

    })
    .addCase(fetchProjects.fulfilled, (state, action)=>{
        state.loading = false;
        state.projects = action.payload;
    })
    .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  }




});


export const { setSingleProject, clearSingleProject } = projectSlice.actions;

export default projectSlice.reducer;
