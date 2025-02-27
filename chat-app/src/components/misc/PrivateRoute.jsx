import { useEffect, useState } from "react";
import { connectSocket, socket, disconnectSocket } from "../../socket";
import { checkIfSignedIn } from "../../utility/util";
import PropTypes from "prop-types";
import useGetUser from "../../hooks/useGetUser";

const PrivateRoute = ({ children }) => {
  const { isLoading, fetchUser } = useGetUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const initializeApp = async () => {
      try {
        const userData = await fetchUser();
        if (userData) {
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

  // Only render once we are mounted and not loading
  if (!mounted || isLoading) return <p>Please Wait</p>;

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
