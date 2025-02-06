import Input from "../Input";
import Image from "../../assets/mnky.png";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery } from "@tanstack/react-query";
import { setUser } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";

export default function AddInfoAuth() {
  const [email, setEmail] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [error, setError] = useState({});
  const { phoneNumber, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const fetchUserData = async () => {
    console.log("Fetching user data...");
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:3000/user/get-user", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const data = await response.json();
    dispatch(setUser(data.data));

    return data;
  };

  console.log(user);

  const { refetch } = useQuery({
    queryFn: fetchUserData,
    queryKey: ["userData"],
    enabled: false,
  });

  const { mutate: handleAuth, isPending } = useMutation({
    mutationFn: auth,
    onSuccess: (data) => {
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("userId", data.data.userId);

      refetch();
      navigate("/");
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
