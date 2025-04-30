import axiosConfig from "./axiosConfig";


export const taskBoardService = {

    createTask: (payload, id) => {
        return axiosConfig.post(`/tasks/${id}`, payload);
      },

      getAlltasks: (id) => {
        return axiosConfig.get(`/tasks/${id}`);
      },

      deleteTask: (id, column, projectId) => {
        return axiosConfig.delete(`/tasks/${projectId}/${id}/${column}`);
      },

      updateTask: (id, column, payload, projectId) => {
        return axiosConfig.put(`/tasks/${projectId}/${id}/${column}`, payload);
      },

      taskBulkUpdateDragAndDrop: (payload, id) => {
        return axiosConfig.put(`/tasks/bulk-update/${id}`, payload);
      },

};
