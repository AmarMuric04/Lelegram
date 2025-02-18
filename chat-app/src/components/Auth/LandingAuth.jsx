import { Telegram } from "../../assets/icons";
import PhoneCountryWrapper from "../PhoneCountryWrapper";
import { Button } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsSigningIn } from "../../store/redux/authSlice";

export default function LandingAuth({ setActivePage }) {
  const { phoneNumber } = useSelector((state) => state.auth);
  const [error, setError] = useState({});
  const dispatch = useDispatch();

  const handleCheckPhoneNumber = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/user/check-phoneNumber",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phoneNumber }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data);
        throw new Error("Validation failed.");
      }

      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const { mutate: checkNumber, isPending } = useMutation({
    mutationFn: handleCheckPhoneNumber,
    onSuccess: (data) => {
      setActivePage("codeSent");
      dispatch(setIsSigningIn(data.data));
    },
  });

  return (
    <div className="min-w-[500px] mt-28 flex justify-center">
      <div className="w-[360px] flex flex-col items-center text-center">
        <div className="flex flex-col items-center mb-10">
          <Telegram
            height="160px"
            width="160px"
            color="#202021"
            bgColor="#8675DC"
          />
          <h1 className="font-semibold text-3xl mt-8">Sign in to Telegram</h1>
          <p className="text-gray-400 w-[70%] mt-4">
            Please confirm your coutry code and enter your phone number.
          </p>
        </div>
        <PhoneCountryWrapper error={error} setError={setError} />

        <div className="checkbox-wrapper-4 w-full h-[4rem] flex items-center">
          <input className="inp-cbx" id="morning" type="checkbox" />
          <label
            className="cbx w-full h-full flex gap-8 items-center"
            htmlFor="morning"
          >
            <span>
              <svg width="12px" height="10px">
                <use xlinkHref="#check-4"></use>
              </svg>
            </span>
            <span className="font-normal">Keep me signed in</span>
          </label>
          <svg className="inline-svg">
            <symbol id="check-4" viewBox="0 0 12 10">
              <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
            </symbol>
          </svg>
        </div>
        <div className="flex flex-col gap-4 w-full my-4">
          {phoneNumber.length > 8 && (
            <Button
              onClick={checkNumber}
              sx={{
                backgroundColor: "#8675DC",
                width: "100%",
                padding: "16px",
                borderRadius: "12px",
              }}
              variant="contained"
            >
              {isPending ? "Checking..." : "Next"}
            </Button>
          )}
          <Button
            sx={{
              backgroundColor: "#8675DC05",
              width: "100%",
              padding: "16px",
              color: "#8675DC",
              borderRadius: "12px",
            }}
            variant="contained"
            onClick={() => setActivePage("qrSent")}
          >
            LOG IN BY QR CODE
          </Button>
        </div>
      </div>
    </div>
  );
}

LandingAuth.propTypes = {
  setActivePage: PropTypes.func.isRequired,
};
