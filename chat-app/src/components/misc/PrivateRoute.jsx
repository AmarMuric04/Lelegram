import { useDispatch } from "react-redux";
import { setUser } from "../../store/redux/authSlice";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { connectSocket, socket, disconnectSocket } from "../../socket";
import { checkIfSignedIn } from "../../utility/util";
import { protectedFetchData } from "../../utility/async";
import PropTypes from "prop-types";

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");

  useEffect(() => {
    connectSocket();
    socket.on("connect", () => {
      // console.log("Connected to Socket.IO with ID:", socket.id);
    });

    socket.on("disconnect", () => {
      // console.log("Disconnected from Socket.IO");
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    checkIfSignedIn(dispatch);
  }, [dispatch]);

  const { data, error } = useQuery({
    queryFn: () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      return protectedFetchData(`/user/get-user/${userId}`, token);
    },
    queryKey: ["userData"],
    enabled: !!token,
  });

  useEffect(() => {
    if (data) {
      if (data?.data) {
        // console.log(data.data, " User Data Successfully Fetched");
        dispatch(setUser(data.data));
      }
    } else if (error) {
      console.error("Error fetching user data:", error);
    }
  }, [data, error, dispatch]);

  return children;
};

export default PrivateRoute;

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
