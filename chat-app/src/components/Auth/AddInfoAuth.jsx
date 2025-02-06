import Input from "../Input";
import Image from "../../assets/mnky.png";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export default function AddInfoAuth() {
  const [email, setEmail] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [error, setError] = useState({});
  const { phoneNumber } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const auth = async () => {
    try {
      const response = await fetch("http://localhost:3000/user/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          email,
          firstName: fname,
          lastName: lname,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const error = new Error("Validation error");
        setError(data);
        throw error;
      }

      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const { mutate: handleAuth, isPending } = useMutation({
    mutationFn: auth,
    onSuccess: (data) => {
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("userId", data.data.userId);

      navigate("/");
      queryClient.invalidateQueries(["userData"]);
      queryClient.invalidateQueries(["chats"]);
    },
  });

  return (
    <div className="min-w-[500px] flex justify-center mt-28 h-screen">
      <div className="flex flex-col items-center w-[360px] text-center">
        <img src={Image} alt="monkey" className="w-[160px]" />
        <div className="text-3xl font-semibold flex items-center gap-2">
          <p>Add more information</p>
        </div>
        <p className="text-gray-400 w-[70%] mt-4 text-center">
          Choose how you <br /> want others to see you.
        </p>
        <div className="flex gap-4 my-4 flex-col w-full">
          <Input
            error={error}
            setError={setError}
            name="email"
            inputValue={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
          >
            Email
          </Input>
          <Input
            error={error}
            setError={setError}
            name="firstName"
            inputValue={fname}
            onChange={(e) => setFname(e.target.value)}
            type="text"
          >
            First Name
          </Input>
          <Input
            error={error}
            setError={setError}
            name="lastName"
            inputValue={lname}
            onChange={(e) => setLname(e.target.value)}
            type="text"
          >
            Last Name
          </Input>
          <button
            onClick={handleAuth}
            className="bg-[#8675DC] w-full rounded-lg cursor-pointer hover:bg-[#8765DC] py-4"
          >
            {isPending ? "Checking..." : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
