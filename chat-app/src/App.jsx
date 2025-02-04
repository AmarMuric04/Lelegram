// import Chat from "./Chat";
import LandingAuth from "./components/Auth/LandingAuth";
import { useState } from "react";
import QRAuth from "./components/Auth/QRAuth";
import CodeAuth from "./components/Auth/CodeAuth";

function App() {
  const [activePage, setActivePage] = useState("landing");
  return (
    <main className="roboto bg-[#202021] min-h-screen w-screen flex flex-col items-center text-white">
      <div className={`transition-all w-[500px] overflow-hidden`}>
        <div
          className={`flex relative gap-[200px] justify-between transition-all duration-400 ${
            activePage === "qrSent"
              ? "right-0"
              : activePage === "codeSent"
              ? "right-[1400px]"
              : "right-[700px]"
          }`}
        >
          <QRAuth setActivePage={setActivePage} />
          <LandingAuth setActivePage={setActivePage} />
          <CodeAuth setActivePage={setActivePage} />
        </div>
      </div>
    </main>
  );
}

export default App;
