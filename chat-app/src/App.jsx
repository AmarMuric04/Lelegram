// import Chat from "./Chat";
// import CodeSentPage from "./components/CodeSentPage";
import { useState } from "react";
import LandingAuth from "./components/LandingAuth";
import CodeSentPage from "./components/CodeSentPage";

function App() {
  const [activePage, setActivePage] = useState("landing");

  const renderPage = () => {
    switch (activePage) {
      case "landing":
        return <LandingAuth setActivePage={setActivePage} />;
      case "codeSent":
        return <CodeSentPage setActivePage={setActivePage} />;
      default:
        return <LandingAuth setActivePage={setActivePage} />;
    }
  };
  return (
    <main className="roboto bg-[#202021] min-h-screen w-screen flex flex-col items-center text-white">
      {renderPage()}
    </main>
  );
}

export default App;
