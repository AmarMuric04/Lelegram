import { useEffect } from "react";
import { connectSocket, socket, disconnectSocket } from "../../socket";
import { checkIfSignedIn } from "../../utility/util";
import PropTypes from "prop-types";
import useGetUser from "../../hooks/useGetUser";

const PrivateRoute = ({ children }) => {
  const { fetchUser } = useGetUser();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const user = await fetchUser();
        if (user) {
          connectSocket();
          checkIfSignedIn();
        }
      } catch (error) {
        console.error("Couldn't get the user", error);
      }
    };

    initializeApp();

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO");
    });

    return () => {
      disconnectSocket();
    };
  }, [fetchUser]);

  return children;
};

export default PrivateRoute;

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
