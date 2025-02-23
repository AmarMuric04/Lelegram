import { useState } from "react";
import PropTypes from "prop-types";
import Image from "../../../assets/mnky.png";
import { useSelector } from "react-redux";
import Input from "../../misc/Input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { postData } from "../../../utility/async";
import { verifyOTP, uploadToCloudinary } from "../../../utility/util";
import { connectSocket } from "../../../socket";

export default function CodeAuth({ setActivePage }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);

  const { email, phoneNumber, firstName, lastName, isSigningIn, staySignedIn } =
    useSelector((state) => state.auth);
  const { url } = useSelector((state) => state.image);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleChange = (value) => setCode(value);

  const signUpMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("phoneNumber", phoneNumber);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);

      if (url) {
        const uploadedImageUrl = await uploadToCloudinary(url);
        if (uploadedImageUrl) {
          formData.append("imageUrl", uploadedImageUrl);
        }
      }
      return postData("/user/create-user", formData);
    },
    onSuccess: ({ data }) => {
      let expiryDate = 1000 * 60 * 60 * 24;

      if (staySignedIn) expiryDate *= 7;
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("expires-in", String(Date.now() + expiryDate));
      connectSocket();

      navigate("/k/");
    },
    onError: (error) => setError(error),
  });

  const signInMutation = useMutation({
    mutationFn: () => postData("/user/signin", { phoneNumber }),
    onSuccess: async ({ data }) => {
      let expiryDate = 1000 * 60 * 60 * 24;

      if (staySignedIn) expiryDate *= 7;
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("expires-in", String(Date.now() + expiryDate));
      connectSocket();

      navigate("/k/");
    },
    onError: (error) => console.log(error),
  });

  const handleSubmit = async () => {
    try {
      await verifyOTP(email, code);
      isSigningIn ? signInMutation.mutate() : signUpMutation.mutate();
      queryClient.invalidateQueries(["userData"]);
    } catch (err) {
      console.error(err);
      setError(err);
    }
  };

  return (
    <div className="min-w-[500px] flex justify-center mt-28 h-screen">
      <div className="flex flex-col items-center w-[360px] text-center">
        <img src={Image} alt="monkey" className="w-[160px]" />
        <div className="text-3xl font-semibold flex items-center gap-2">
          <p>{email}</p>
          <svg
            onClick={() => setActivePage("addInfo")}
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            className="text-[#8c8c8c] hover:text-white transition-all cursor-pointer"
          >
            <path
              fill="currentColor"
              d="m14.06 9.02l.92.92L5.92 19H5v-.92zM17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83l3.75 3.75l1.83-1.83a.996.996 0 0 0 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29m-3.6 3.19L3 17.25V21h3.75L17.81 9.94z"
            />
          </svg>
        </div>
        <p className="theme-text-2 w-[70%] mt-4 text-center">
          We have sent a message <br /> with the code.
        </p>
        <div className="flex gap-4 my-4 flex-col w-full">
          <Input
            error={error}
            value={code}
            inputValue={code}
            setError={setError}
            name="code"
            textClass="bg-[#202021]"
            onChange={(e) => handleChange(e.target.value)}
            type="text"
          >
            Code
          </Input>
        </div>
        {code && (
          <button
            onClick={handleSubmit}
            className="bg-[#8675DC] w-full rounded-lg cursor-pointer hover:bg-[#8765DC] py-4"
          >
            NEXT
          </button>
        )}
      </div>
    </div>
  );
}

CodeAuth.propTypes = {
  setActivePage: PropTypes.func.isRequired,
};
