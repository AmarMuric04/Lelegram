import { useState } from "react";
import PropTypes from "prop-types";
import Image from "../../assets/mnky.png";
import { useSelector } from "react-redux";
import Input from "../Input";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function CodeAuth({ setActivePage }) {
  const [code, setCode] = useState("");
  const { phoneNumber, isSigningIn } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleChange = (value) => {
    setCode(value);
  };

  const handleSignIn = async () => {
    try {
      const response = await fetch("http://localhost:3000/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Validation failed.");
      }

      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const { mutate: signIn, isPending } = useMutation({
    mutationFn: handleSignIn,
    onSuccess: (data) => {
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("userId", data.data.userId);

      navigate("/");
      queryClient.invalidateQueries(["userData"]);
    },
  });

  return (
    <div className="min-w-[500px] flex justify-center mt-28 h-screen">
      <div className="flex flex-col items-center w-[360px] text-center">
        <img src={Image} alt="monkey" className="w-[160px]" />
        <div className="text-3xl font-semibold flex items-center gap-2">
          <p>{phoneNumber}</p>
          <svg
            onClick={() => setActivePage("landing")}
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
        <p className="text-gray-400 w-[70%] mt-4 text-center">
          We have sent a message <br /> with the code.
        </p>
        <div className="flex gap-4 my-4 flex-col w-full">
          <Input
            inputValue={code}
            onChange={(e) => handleChange(e.target.value)}
            type="text"
          >
            Code
          </Input>
        </div>
        {code !== "" && (
          <button
            onClick={() => {
              if (isSigningIn) signIn();
              else setActivePage("addInfo");
            }}
            className="bg-[#8675DC] w-full rounded-lg cursor-pointer hover:bg-[#8765DC] py-4"
          >
            {isPending ? "PLEASE WAIT..." : "NEXT"}
          </button>
        )}
      </div>
    </div>
  );
}

CodeAuth.propTypes = {
  setActivePage: PropTypes.func.isRequired,
};
