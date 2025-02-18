import { useDispatch } from "react-redux";
import { setUser } from "../store/redux/authSlice";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { connectSocket, socket, disconnectSocket } from "../socket";
import { checkIfSignedIn } from "../utility/util";

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const [isSignedIn, setIsSignedIn] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    connectSocket();
    socket.on("connect", () => {
      console.log("Connected to Socket.IO with ID:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO");
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    setIsSignedIn(checkIfSignedIn(dispatch));
  }, [dispatch]);

  const fetchUserData = async () => {
    const userId = localStorage.getItem("userId");

    try {
      const response = await fetch(
        "http://localhost:3000/user/get-user/" + userId,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch the user.");
      }

      const data = await response.json();
      dispatch(setUser(data.data));

      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  useQuery({
    queryFn: fetchUserData,
    queryKey: ["userData"],
    enabled: isSignedIn,
  });

  return children;
};

export default PrivateRoute;
