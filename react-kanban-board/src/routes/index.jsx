import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { routes } from "./routes";
import PrivateRoute from "./privateRoutes";
import PublicRoute from "./publicRoutes";

const LoadingFallback = () => <div className="">Loading...</div>;

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {routes.public.map(({ path, element: Element, restricted }, index) => (
          <Route key={index} element={<PublicRoute restricted={restricted} />}>
            <Route
              key={path}
              path={path}
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <Element />
                </Suspense>
              }
            ></Route>
          </Route>
        ))}

        <Route element={<PrivateRoute />}>
          {routes.private.map(({ path, element: Element }) => (
            <Route
              key={path}
              path={path}
              element={

                <Suspense fallback={<LoadingFallback />}>
                  <Element />
                </Suspense>
                
              }
            />
          ))}
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
