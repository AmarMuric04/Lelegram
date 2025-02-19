import PropTypes from "prop-types";
import Image from "../../../assets/qr.png";
import { Button } from "@mui/material";

export default function QRAuth({ setActivePage }) {
  return (
    <div
      className={`relative transition-all min-w-[500px] flex justify-center mt-28 h-screen`}
    >
      <div className="flex w-[500px] flex-col items-center">
        <img src={Image} alt="qr" className="w-[240px]" />
        <h1 className="font-semibold text-3xl my-10">
          Log in to Telegram by QR Code
        </h1>
        <ol className="mb-4 flex flex-col gap-2">
          <li>1. Open Telegram on your phone</li>
          <li>
            2. Go to{" "}
            <strong>
              Settings {">"} Devices {">"} Link Desktop Device
            </strong>
          </li>
          <li>3. Point your phone at this screen to confirm login</li>
        </ol>
        <Button
          sx={{
            backgroundColor: "#8675DC05",
            width: "100%",
            padding: "16px",
            color: "#8675DC",
            borderRadius: "12px",
          }}
          variant="contained"
          onClick={() => setActivePage("landing")}
        >
          LOG IN BY PHONE NUMBER
        </Button>
      </div>
    </div>
  );
}

QRAuth.propTypes = {
  setActivePage: PropTypes.func.isRequired,
};
