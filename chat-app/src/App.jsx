// import Chat from "./Chat";
import LandingAuth from "./components/Auth/LandingAuth";
import { useEffect, useState } from "react";
import QRAuth from "./components/Auth/QRAuth";
import CodeAuth from "./components/Auth/CodeAuth";
import AddInfoAuth from "./components/Auth/AddInfoAuth";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function App() {
  const [activePage, setActivePage] = useState("landing");
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // if (user) navigate("/");
  }, [user, navigate]);

  let move;

  if (activePage === "qrSent") move = "right-[0px]";
  if (activePage === "landing") move = "right-[700px]";
  if (activePage === "codeSent") move = "right-[1400px]";
  if (activePage === "addInfo") move = "right-[2100px]";

  return (
    <main className="monsterrat bg-[#202021] min-h-screen w-screen flex flex-col items-center text-white">
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
