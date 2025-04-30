import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { notify } from "../utils/toastNotifications";
import { setAuth } from "../store/authSlice";

const useGoogleAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const popupRef = useRef(null);
  const timeoutRef = useRef(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleAuthMessage = useCallback(
    (event) => {
      // const AUTH_ORIGIN = "http://localhost:8000";

      const AUTH_ORIGIN =
        "https://backend-react-kanban-board-bjaxcwbbh6ejdsdp.canadacentral-01.azurewebsites.net";

      if (event.origin !== AUTH_ORIGIN) return;

      switch (event.data.type) {
        case "AUTH_SUCCESS":
          notify.success("Login Successful");
          dispatch(setAuth(event.data.data));
          navigate("/projects");
          setIsAuthenticating(false);
          break;
        case "AUTH_ERROR":
          notify.error("Authentication failed");
          setIsAuthenticating(false);
          break;
        default:
          break;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    },
    [dispatch, navigate]
  );

  const handleAuthTimeout = useCallback(() => {
    if (popupRef.current) {
      popupRef.current.close();
      popupRef.current = null;
      setIsAuthenticating(false);
      notify.error("Authentication timed out");
    }
  }, []);

  useEffect(() => {
    window.addEventListener("message", handleAuthMessage);

    return () => {
      window.removeEventListener("message", handleAuthMessage);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [handleAuthMessage]);

  const continueWithGoogle = useCallback(() => {
    setIsAuthenticating(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const width = 500;
    const height = 500;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    if (popupRef.current) {
      popupRef.current.close();
    }

    try {
      popupRef.current = window.open(
        `${"https://backend-react-kanban-board-bjaxcwbbh6ejdsdp.canadacentral-01.azurewebsites.net"}/api/auth/google`,
        "Google Login",
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,status=1`
      );

      if (!popupRef.current || popupRef.current.closed) {
        setIsAuthenticating(false);
        notify.error("Please allow popups for this website");
        return;
      }

      timeoutRef.current = setTimeout(handleAuthTimeout, 300000);
    } catch (error) {
      setIsAuthenticating(false);
      notify.error("Unable to open Google login window");
      console.error("Google login error:", error);
    }
  }, [handleAuthTimeout]);

  return { continueWithGoogle, isAuthenticating };
};

export { useGoogleAuth };
