import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { protectedFetchData } from "../utility/async";
import { setUser } from "../store/redux/authSlice";

const useGetUser = () => {
  const [user, setUserState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const fetchUser = useCallback(async () => {
    if (typeof window === "undefined") return null;

    setIsLoading(true);
    setError(null);

    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        throw new Error("Missing userId or token");
      }

      const data = await protectedFetchData(`/user/get-user/${userId}`, token);
      setUserState(data.data);
      dispatch(setUser(data.data));
      return data.data;
    } catch (err) {
      console.error("Couldn't get the user", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  return { user, isLoading, error, fetchUser };
};

export default useGetUser;
