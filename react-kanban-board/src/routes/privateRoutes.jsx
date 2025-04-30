import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "./routes";

const PrivateRoute = () => {

  const { isAuthenticated } = useSelector((state) => state.auth);
  
  
    return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />
  };
  
  export default PrivateRoute;