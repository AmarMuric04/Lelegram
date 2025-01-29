import { Telegram } from "../assets/icons";
import PhoneCountryWrapper from "./PhoneCountryWrapper";
import { Button } from "@mui/material";
import PropTypes from "prop-types";

export default function LandingAuth({ setActivePage }) {
  return (
    <div className="w-[360px] mt-28 flex items-center flex-col text-center">
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
      <PhoneCountryWrapper />

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
        <Button
          sx={{
            backgroundColor: "#8675DC",
            width: "100%",
            padding: "16px",
            borderRadius: "12px",
          }}
          variant="contained"
          onClick={() => setActivePage("codeSent")}
        >
          NEXT
        </Button>
        <Button
          sx={{
            backgroundColor: "#8675DC05",
            width: "100%",
            padding: "16px",
            color: "#8675DC",
            borderRadius: "12px",
          }}
          variant="contained"
        >
          LOG IN BY QR CODE
        </Button>
      </div>
    </div>
  );
}

LandingAuth.propTypes = {
  setActivePage: PropTypes.func.isRequired,
};
