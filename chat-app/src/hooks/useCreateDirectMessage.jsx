import { useMutation } from "@tanstack/react-query";
import { protectedPostData } from "../utility/async";
import { useNavigate } from "react-router-dom";

const useCreateDirectMessage = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const {
    mutate: createDirectMessage,
    isLoading,
    error,
  } = useMutation({
    mutationFn: ({ userId }) =>
      protectedPostData("/user/create-direct-message", { userId }, token),
    onSuccess: (data) => {
      console.log("ljep");
      navigate("/k/" + data.chat._id);
    },
  });

  return { createDirectMessage, isLoading, error };
};

export default useCreateDirectMessage;
