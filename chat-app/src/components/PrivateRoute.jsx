import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";
import { useQuery } from "@tanstack/react-query";

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");

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

      console.log(data.data);

      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  useQuery({
    queryFn: fetchUserData,
    queryKey: ["userData"],
    enabled: !!token,
  });

  return children;
};

export default PrivateRoute;
