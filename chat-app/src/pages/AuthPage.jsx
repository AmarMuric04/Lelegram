import LandingAuth from "../components/auth/authSections/LandingAuth";
import { useEffect, useState } from "react";
// import QRAuth from "../components/auth/authSections/QRAuth";
import CodeAuth from "../components/auth/authSections/CodeAuth";
import AddInfoAuth from "../components/auth/authSections/AddInfoAuth";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function AuthPage() {
  const [activePage, setActivePage] = useState("landing");
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) navigate("/k/");
  }, [user, navigate, token]);

  let move;

  // if (activePage === "qrSent") move = "right-[0px]";
  if (activePage === "landing") move = "right-[0px]";
  if (activePage === "addInfo") move = "right-[700px]";
  if (activePage === "codeSent") move = "right-[1400px]";

  return (
    <main className="monsterrat bg-[#202021] min-h-screen max-h-screen w-screen flex flex-col items-center text-white">
      <div className={`transition-all w-[500px] overflow-hidden`}>
        <div
          className={`flex relative gap-[200px] justify-between transition-all duration-400 ${move}`}
        >
          {/* <QRAuth setActivePage={setActivePage} /> */}
          <LandingAuth setActivePage={setActivePage} />
          <AddInfoAuth setActivePage={setActivePage} />
          <CodeAuth setActivePage={setActivePage} />
        </div>
      </div>
    </main>
  );
}

export default AuthPage;
