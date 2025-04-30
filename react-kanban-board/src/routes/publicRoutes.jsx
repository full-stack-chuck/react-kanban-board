import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "./routes";

const PublicRoute = ({restricted = false}) =>{

    const { isAuthenticated } = useSelector((state) => state.auth);

    return isAuthenticated && restricted ? (<Navigate to={ROUTES.PROJECT} replace />) : (<Outlet />)
}

export default PublicRoute;