import { useEffect, useLayoutEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import useToken from "./useToken";
import useUser from "./useUser";

const useAuth = () => {
  const { token, setToken } = useToken();
  const { setUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Define public routes that don't need authentication
  const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/how_it_works',
    '/faqs',
    '/pricing',
    '/aboutus',
    '/our_journey',
    '/contact',
    '/resources',
    '/forgot_password',
    '/verify-2fa',
    '/verify-email',
    '/reset_password',
    '/otp_verification'
  ];

  useEffect(() => {
    const fetchMe = async () => {
      try {
        if (!token) {
          setUser(null);
          // Only redirect if it's NOT a public route
          const isPublicRoute = publicRoutes.includes(location.pathname);
          if (!isPublicRoute) {
            navigate("/");
          }
          return;
        }

        const response = await axios.get("/v1/api/auth/me");
        setUser(response.data.user);

        // If authenticated user is on a public/auth page, redirect to dashboard
        const isPublicRoute = publicRoutes.includes(location.pathname);
        if (isPublicRoute && location.pathname !== "/") {
          navigate("/"); // Redirect authenticated users from login/signup to dashboard
        }
      } catch (error) {
        setUser(null);
        setToken(null);

        // Only redirect if it's NOT a public route
        const isPublicRoute = publicRoutes.includes(location.pathname);
        if (!isPublicRoute) {
          navigate("/");
        }
      }
    };

    fetchMe();
  }, [token]);

  // Attach Authorization header
  useLayoutEffect(() => {
    const authInterceptor = axios.interceptors.request.use((config) => {
      config.headers.Authorization =
        !config._retry && token
          ? `Bearer ${token}`
          : config.headers.Authorization;

      return config;
    });
    return () => {
      axios.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

  // Attach base URL if not full URL
  useLayoutEffect(() => {
    const baseURLInterceptor = axios.interceptors.request.use((config) => {
      if (!config.url.startsWith("http")) {
        config.url = `${process.env.REACT_APP_API_URL}${config.url}`;
      }
      return config;
    });

    return () => {
      axios.interceptors.request.eject(baseURLInterceptor);
    };
  }, []);
};

export default useAuth;
