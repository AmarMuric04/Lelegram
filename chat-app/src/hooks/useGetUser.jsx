import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setUser } from "../store/redux/authSlice";
import { useEffect } from "react";
import { protectedFetchData } from "../utility/async";
import { useQueryClient } from "@tanstack/react-query";

const useGetUser = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token) {
      queryClient.removeQueries(["userData"]);
    }
  }, [token, queryClient]);

  const { data, error, isLoading } = useQuery({
    queryFn: () => {
      const userId = localStorage.getItem("userId");
      return protectedFetchData(`/user/get-user/${userId}`, token);
    },
    queryKey: ["userData"],
    enabled: !!token,
  });

  useEffect(() => {
    if (data?.data) {
      dispatch(setUser(data.data));
    } else if (error) {
      dispatch(setUser(null));
      console.error("Error fetching user data:", error);
    }
  }, [data, error, dispatch]);

  return { user: data?.data, isLoading, error };
};

export default useGetUser;
