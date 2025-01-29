// import Chat from "./Chat";
import { Telegram } from "./assets/icons";
import PhoneCountryWrapper from "./components/PhoneCountryWrapper";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";

function App() {
  return (
    <main className="bg-[#202021] h-screen w-screen flex flex-col items-center justify-center text-white">
      <div className="w-[320px] flex items-center flex-col text-center">
        <Telegram
          height="180px"
          width="180px"
          color="#202021"
          bgColor="#8675DC"
        />
        <h1 className="font-semibold text-4xl mt-8">Sign in to Telegram</h1>
        <p className="text-gray-400 w-[90%] mt-4">
          Please confirm your coutry code and enter your phone number.
        </p>
        <PhoneCountryWrapper />

        <div className="relative w-full">
          <FormControlLabel
            className="absolute top-0 left-1/2 -translate-x-1/2 z-40 w-full h-[3rem]"
            control={<Checkbox defaultChecked />}
            label="Label"
          />
          <Button
            className="w-full bg-red-400 h-[3rem] absolute top-0 left-0 z-0"
            variant="text"
          ></Button>
        </div>
      </div>
    </main>
  );
}

export default App;
