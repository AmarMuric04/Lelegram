import Image from "../assets/tg-bg.png";
import { useEffect, useState } from "react";
import Input from "./Input";

export default function Main() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [addChannel, setAddChannel] = useState(false);

  const handleSetName = (value) => {
    setName(value);
  };

  const handleSetDesc = (value) => {
    setDesc(value);
  };

  const handleCreateChat = () => {
    fetch("http://localhost:3000/chat/create-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description: desc,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const unsetOpen = () => setOpen(false);

    if (open) {
      const timeout = setTimeout(() => {
        document.body.addEventListener("click", unsetOpen);
      }, 10);

      return () => {
        clearTimeout(timeout);
        document.body.removeEventListener("click", unsetOpen);
      };
    }

    return () => {
      document.body.removeEventListener("click", unsetOpen);
    };
  }, [open]);

  return (
    <main className="bg-[#202021] w-screen h-screen flex justify-center">
      <div className="w-[85%] flex justify-between">
        <sidebar
          className={`border-l-2 transition overflow-hidden border-[#151515] w-[25%] relative flex`}
        >
          <div
            className={`w-full flex relative transition-all ${
              addChannel ? "-left-full" : "left-0"
            }`}
          >
            <div className="min-w-full h-full bg-[#242424]">
              <div className="absolute right-5 bottom-5">
                <div className="relative">
                  <button
                    onClick={() => setOpen(!open)}
                    className="bg-[#8675DC] cursor-pointer hover:bg-[#8765DC] transition-all p-4 text-white rounded-full"
                  >
                    {open && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeWidth="2"
                          d="M20 20L4 4m16 0L4 20"
                        />
                      </svg>
                    )}
                    {!open && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M3 21v-4.25L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.438.65T21 6.4q0 .4-.137.763t-.438.662L7.25 21zM17.6 7.8L19 6.4L17.6 5l-1.4 1.4z"
                        />
                      </svg>
                    )}
                  </button>
                  <div
                    className={`absolute w-[140px] bottom-[120%] right-0 bg-[#252525] p-2 text-xs text-white rounded-md  ${
                      open ? "opacity-100 scale-100" : "opacity-0 scale-50"
                    } transition-all shadow-md`}
                  >
                    <button
                      onClick={() => setAddChannel(true)}
                      className="w-full cursor-pointer flex justify-between gap-5 items-center hover:bg-[#303030] transition-all p-2 rounded-md"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          d="M14 14V6m0 8l6.102 3.487a.6.6 0 0 0 .898-.52V3.033a.6.6 0 0 0-.898-.521L14 6m0 8H7a4 4 0 1 1 0-8h7M7.757 19.3L7 14h4l.677 4.74a1.98 1.98 0 0 1-3.92.56Z"
                        />
                      </svg>
                      <p className="font-semibold flex-shrink-0">New Channel</p>
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-white flex justify-between items-center py-2 px-5 h-[55px]">
                <svg
                  className="w-[10%]"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 32 32"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 8h22M5 16h22M5 24h22"
                    className="text-[#ccc]"
                  />
                </svg>
                <div className="relative flex gap-5 items-center w-[85%] h-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="absolute left-3 text-[#ccc]"
                  >
                    <path
                      fill="currentColor"
                      d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"
                    />
                  </svg>
                  <input
                    type="text"
                    className="pl-[50px] bg-[#202021] w-full h-full rounded-full"
                  />
                </div>
              </div>
            </div>
            <div className="min-w-full h-full relative text-white">
              <div
                className={`absolute right-5 transition-all ${
                  name !== "" ? "bottom-5" : "-bottom-20"
                }`}
              >
                <button
                  onClick={handleCreateChat}
                  className="bg-[#8675DC] cursor-pointer hover:bg-[#8765DC] transition-all p-4 text-white rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="text-[#ccc]"
                  >
                    <path
                      fill="currentColor"
                      d="m16.172 11l-5.364-5.364l1.414-1.414L20 12l-7.778 7.778l-1.414-1.414L16.172 13H4v-2z"
                    />
                  </svg>
                </button>
              </div>
              <div className="bg-[#242424] px-8 py-4">
                <div className="flex items-center text-white text-xl font-semibold gap-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="text-[#ccc] cursor-pointer"
                    onClick={() => setAddChannel(false)}
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m12 19l-7-7l7-7m7 7H5"
                    />
                  </svg>
                  <p>New Channel</p>
                </div>
                <div className="flex items-center flex-col">
                  <div className="bg-[#8675DC] text-white p-10 rounded-full my-12 group cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="45"
                      height="45"
                      viewBox="0 0 24 24"
                      className="group-hover:scale-150 transition-all"
                    >
                      <path
                        fill="currentColor"
                        d="M3 21q-.825 0-1.412-.587T1 19V7q0-.825.588-1.412T3 5h3.15L7.4 3.65q.275-.3.663-.475T8.875 3H13q.425 0 .713.288T14 4t-.288.713T13 5H8.875L7.05 7H3v12h16v-8q0-.425.288-.712T20 10t.713.288T21 11v8q0 .825-.587 1.413T19 21zM19 5h-1q-.425 0-.712-.288T17 4t.288-.712T18 3h1V2q0-.425.288-.712T20 1t.713.288T21 2v1h1q.425 0 .713.288T23 4t-.288.713T22 5h-1v1q0 .425-.288.713T20 7t-.712-.288T19 6zm-8 12.5q1.875 0 3.188-1.312T15.5 13t-1.312-3.187T11 8.5T7.813 9.813T6.5 13t1.313 3.188T11 17.5m0-2q-1.05 0-1.775-.725T8.5 13t.725-1.775T11 10.5t1.775.725T13.5 13t-.725 1.775T11 15.5"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-4 w-full">
                    <Input
                      textClass={"bg-[#242424]"}
                      inputValue={name}
                      onChange={(e) => handleSetName(e.target.value)}
                      type="text"
                    >
                      Channel name
                    </Input>

                    <Input
                      textClass={"bg-[#242424]"}
                      inputValue={desc}
                      onChange={(e) => handleSetDesc(e.target.value)}
                      type="text"
                    >
                      Description (optional)
                    </Input>
                  </div>
                </div>
              </div>
              <p className="text-[#ccc] text-sm text-center mt-2">
                You can provide an optional description for your channel.
              </p>
            </div>
          </div>
        </sidebar>
        <img className="w-[75%] h-screen object-cover" src={Image} />
      </div>
    </main>
  );
}
