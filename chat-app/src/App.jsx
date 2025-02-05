// import Chat from "./Chat";
import LandingAuth from "./components/Auth/LandingAuth";
import { useState } from "react";
import QRAuth from "./components/Auth/QRAuth";
import CodeAuth from "./components/Auth/CodeAuth";
import AddInfoAuth from "./components/Auth/AddInfoAuth";

function App() {
  const [activePage, setActivePage] = useState("landing");

  let move;

  if (activePage === "qrSent") move = "right-[0px]";
  if (activePage === "landing") move = "right-[700px]";
  if (activePage === "codeSent") move = "right-[1400px]";
  if (activePage === "addInfo") move = "right-[2100px]";

  return (
    <main className="roboto bg-[#202021] min-h-screen w-screen flex flex-col items-center text-white">
      <div className={`transition-all w-[500px] overflow-hidden`}>
        <div
          className={`flex relative gap-[200px] justify-between transition-all duration-400 ${move}`}
        >
          <QRAuth setActivePage={setActivePage} />
          <LandingAuth setActivePage={setActivePage} />
          <CodeAuth setActivePage={setActivePage} />
          <AddInfoAuth setActivePage={setActivePage} />
        </div>
      </div>
    </main>
  );
}

export default App;
