import { useDispatch } from "react-redux";
import { setUser } from "../../store/redux/authSlice";
import { useEffect } from "react";
import { connectSocket, socket, disconnectSocket } from "../../socket";
import { checkIfSignedIn } from "../../utility/util";
import PropTypes from "prop-types";

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeSocket = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        const response = await fetch(
          import.meta.env.VITE_SERVER_PORT + "/user/get-user/" + userId,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        const data = await response.json();

        dispatch(setUser(data?.data));

        connectSocket();
        checkIfSignedIn(dispatch);
      } catch (error) {
        console.log("Couldn't get the user", error);
      }
    };

    initializeSocket();
    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO");
    });

    return () => {
      disconnectSocket();
    };
  }, [dispatch]);

  return children;
};

export default PrivateRoute;

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
