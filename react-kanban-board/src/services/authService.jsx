import axiosConfig from "./axiosConfig";

export const authService = {
  register: (payload) => {
    return axiosConfig.post(`/users/auth/create`, payload);
  },

  login: (payload) => {
    return axiosConfig.post(`/users/auth/login`, payload);
  },

};
