import { lazy } from "react";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  TASK_BOARD: "/projects/:id/taskBoard",
  PROJECT: "/projects",
};

export const routes = {
  public: [
    {
      path: ROUTES.HOME,
      element: lazy(() => import("../pages/Landing")),
      restricted: true,
    },

    {
      path: ROUTES.REGISTER,
      element: lazy(() => import("../pages/auth/Register")),
      restricted: true,
    },

    {
      path: ROUTES.LOGIN,
      element: lazy(() => import("../pages/auth/Login")),
      restricted: true,
    },
  ],
  private: [
    {
      path: ROUTES.PROJECT,
      element: lazy(() => import("../pages/projects/ProjectDashboard")),
    },

    {
      path: ROUTES.TASK_BOARD,
      element: lazy(() => import("../pages/board/TaskBoard")),
    },


  ],
};
