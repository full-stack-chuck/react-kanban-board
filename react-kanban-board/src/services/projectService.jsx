import axiosConfig from "./axiosConfig";

export const projectService = {
  createProject: (payload) => {
    return axiosConfig.post("/projects", payload);
  },

  getAllProjects: () => {
    return axiosConfig.get("/projects");
  },

  deleteProject: (id) => {
    return axiosConfig.delete(`/projects/${id}`);
  },

  updateProject: (id, payload) => {
    return axiosConfig.put(`/projects/${id}`, payload);
  },
};
