import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { protectedFetchData } from "../utility/async";

const useGetUser = () => {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        const data = await protectedFetchData(
          `/user/get-user/${userId}`,
          token
        );

        dispatch(setUser(data.data));
      } catch (error) {
        console.log("Coudln't get the user", error);
      }
    })();
  }, [dispatch]);

  return { user };
};

export default useGetUser;
