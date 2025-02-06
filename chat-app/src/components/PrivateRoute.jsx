import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../store/authSlice";

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const fetchUserData = async () => {
      const response = await fetch("http://localhost:3000/user/get-user", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();
      dispatch(setUser(data.data));

      return data;
    };

    if (token && userId) {
      fetchUserData();
    } else {
      navigate("/auth");
    }
  }, [dispatch, navigate]);

  return children;
};

export default PrivateRoute;
