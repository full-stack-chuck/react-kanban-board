import axios from "axios";
import Swal from "sweetalert2";

const axiosConfig = axios.create({
  baseURL: "https://backend-react-kanban-board-bjaxcwbbh6ejdsdp.canadacentral-01.azurewebsites.net/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosConfig.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (error.response && error.response.status === 401) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Session time out, please login again",
      });

      localStorage.removeItem("user");

      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    }

    return Promise.reject(error);
  }
);

export default axiosConfig;
