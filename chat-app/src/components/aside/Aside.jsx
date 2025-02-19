import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import PopUpMenu from "../misc/PopUpMenu";
import PopUpMenuItem from "../misc/PopUpMenuItem";
import Search from "../misc/Search";
import AsideChatWrapper from "./AsideChatWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setIsFocused, setSearch } from "../../store/redux/searchSlice";
import AsideChat from "./AsideChat";
import { signOut } from "../../utility/util";
import ModifyChat from "../chat/ModifyChat";
import { CrossSVG, MegaphoneSVG, PenSVG } from "../../../public/svgs";
import { protectedPostData } from "../../utility/async";

export default function Aside() {
  const [activeSelect, setActiveSelect] = useState("chats");
  const [addingChannel, setAddingChannel] = useState(false);

  const { isFocused } = useSelector((state) => state.search);
  const { data } = useSelector((state) => state.search);
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const { mutate: addChat } = useMutation({
    mutationFn: ({ chat }) => {
      const formData = new FormData();
      formData.append("name", chat.name);
      formData.append("description", chat.desc);
      formData.append("imageUrl", chat.imageUrl);
      return protectedPostData("/chat/create-chat", formData, token);
    },
    onSuccess: () => {
      setAddingChannel(false);
      queryClient.invalidateQueries(["userData"]);
    },
  });

  return (
    <aside
      className={`border-l-2 transition overflow-hidden border-[#151515] min-w-[21.5vw] max-w-[21.5vw] relative flex`}
    >
      <div
        className={`w-full flex relative transition-all ${
          addingChannel ? "-left-full" : "left-0"
        }`}
      >
        <div className="min-w-full h-full bg-[#242424]">
          <div
            className={`absolute right-5 transition-all ${
              isFocused ? "-bottom-20" : "bottom-5"
            }`}
          >
            <PopUpMenu
              tl={true}
              icon={<PenSVG dimensions={24} />}
              iconWhenClicked={<CrossSVG dimensions={24} />}
              buttonClasses={
                "bg-[#8675DC] cursor-pointer hover:bg-[#8765DC] transition-all p-4 text-white rounded-full"
              }
            >
              <PopUpMenuItem
                itemClasses="justify-between"
                action={() => setAddingChannel(true)}
              >
                <MegaphoneSVG dimensions={20} />
                <p className="font-semibold flex-shrink-0">New Channel</p>
              </PopUpMenuItem>
            </PopUpMenu>
          </div>
          <div className="text-white flex justify-between items-center py-2 px-5 h-[58px]">
            <button
              onClick={() => {
                dispatch(setIsFocused(false));
                dispatch(setSearch([]));
              }}
              className="hover:bg-[#303030] cursor-pointer transition-all text-[#ccc] rounded-full"
            >
              {!isFocused && (
                <PopUpMenu
                  br={true}
                  buttonClasses="cursor-pointer p-2 rounded-full"
                  icon={
                    <svg
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
                      />
                    </svg>
                  }
                >
                  <PopUpMenuItem action={() => setAddingChannel(true)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <rect width="24" height="24" fill="none" />
                      <path
                        fill="currentColor"
                        d="m12 18l-4.2 1.8q-1 .425-1.9-.162T5 17.975V5q0-.825.588-1.412T7 3h10q.825 0 1.413.588T19 5v12.975q0 1.075-.9 1.663t-1.9.162zm0-2.2l5 2.15V5H7v12.95zM12 5H7h10z"
                      />
                    </svg>
                    <p className="text-[1rem] font-semibold flex-shrink-0">
                      Saved Messages
                    </p>
                  </PopUpMenuItem>
                  <PopUpMenuItem>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <rect width="24" height="24" fill="none" />
                      <path
                        fill="currentColor"
                        d="m12 18l4-4l-1.4-1.4l-1.6 1.6V10h-2v4.2l-1.6-1.6L8 14zM5 8v11h14V8zM3 21V5.8L5.3 3h13.4L21 5.8V21zM5.4 6h13.2l-.85-1H6.25zm6.6 7.5"
                      />
                    </svg>
                    <p className="text-[1rem] font-semibold flex-shrink-0">
                      Archived Chats
                    </p>
                  </PopUpMenuItem>
                  <PopUpMenuItem>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <rect width="24" height="24" fill="none" />
                      <path
                        fill="currentColor"
                        d="M10.825 22q-.675 0-1.162-.45t-.588-1.1L8.85 18.8q-.325-.125-.612-.3t-.563-.375l-1.55.65q-.625.275-1.25.05t-.975-.8l-1.175-2.05q-.35-.575-.2-1.225t.675-1.075l1.325-1Q4.5 12.5 4.5 12.337v-.675q0-.162.025-.337l-1.325-1Q2.675 9.9 2.525 9.25t.2-1.225L3.9 5.975q.35-.575.975-.8t1.25.05l1.55.65q.275-.2.575-.375t.6-.3l.225-1.65q.1-.65.588-1.1T10.825 2h2.35q.675 0 1.163.45t.587 1.1l.225 1.65q.325.125.613.3t.562.375l1.55-.65q.625-.275 1.25-.05t.975.8l1.175 2.05q.35.575.2 1.225t-.675 1.075l-1.325 1q.025.175.025.338v.674q0 .163-.05.338l1.325 1q.525.425.675 1.075t-.2 1.225l-1.2 2.05q-.35.575-.975.8t-1.25-.05l-1.5-.65q-.275.2-.575.375t-.6.3l-.225 1.65q-.1.65-.587 1.1t-1.163.45zM11 20h1.975l.35-2.65q.775-.2 1.438-.587t1.212-.938l2.475 1.025l.975-1.7l-2.15-1.625q.125-.35.175-.737T17.5 12t-.05-.787t-.175-.738l2.15-1.625l-.975-1.7l-2.475 1.05q-.55-.575-1.212-.962t-1.438-.588L13 4h-1.975l-.35 2.65q-.775.2-1.437.588t-1.213.937L5.55 7.15l-.975 1.7l2.15 1.6q-.125.375-.175.75t-.05.8q0 .4.05.775t.175.75l-2.15 1.625l.975 1.7l2.475-1.05q.55.575 1.213.963t1.437.587zm1.05-4.5q1.45 0 2.475-1.025T15.55 12t-1.025-2.475T12.05 8.5q-1.475 0-2.487 1.025T8.55 12t1.013 2.475T12.05 15.5M12 12"
                      />
                    </svg>
                    <p className="text-[1rem] font-semibold flex-shrink-0">
                      Settings
                    </p>
                  </PopUpMenuItem>
                  <PopUpMenuItem>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <rect width="24" height="24" fill="none" />
                      <path
                        fill="currentColor"
                        d="M12 21q-3.75 0-6.375-2.625T3 12t2.625-6.375T12 3q.35 0 .688.025t.662.075q-1.025.725-1.638 1.888T11.1 7.5q0 2.25 1.575 3.825T16.5 12.9q1.375 0 2.525-.613T20.9 10.65q.05.325.075.662T21 12q0 3.75-2.625 6.375T12 21m0-2q2.2 0 3.95-1.213t2.55-3.162q-.5.125-1 .2t-1 .075q-3.075 0-5.238-2.163T9.1 7.5q0-.5.075-1t.2-1q-1.95.8-3.163 2.55T5 12q0 2.9 2.05 4.95T12 19m-.25-6.75"
                      />
                    </svg>
                    <p className="text-[1rem] font-semibold flex-shrink-0">
                      Dark Mode
                    </p>
                  </PopUpMenuItem>
                  <PopUpMenuItem>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <rect width="24" height="24" fill="none" />
                      <path
                        fill="currentColor"
                        d="M11 17h2v-6h-2zm1-8q.425 0 .713-.288T13 8t-.288-.712T12 7t-.712.288T11 8t.288.713T12 9m0 13q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"
                      />
                    </svg>
                    <p className="text-[1rem] font-semibold flex-shrink-0">
                      Telegram Features
                    </p>
                  </PopUpMenuItem>
                  <PopUpMenuItem>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <rect width="24" height="24" fill="none" />
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5a7 7 0 0 1-7 7v0a7 7 0 0 1-7-7zm3-3v-.425c0-.981.384-1.96 1.326-2.238c1.525-.45 3.823-.45 5.348 0C15.616 3.615 16 4.594 16 5.575V6m2.5 1.5L22 4M5.5 7.5L2 4m4 14l-4 3m3-9H1.5m21 0H19m-1 6l4 3m-10-8v8"
                      />
                    </svg>
                    <p className="text-[1rem] font-semibold flex-shrink-0">
                      Report A Bug
                    </p>
                  </PopUpMenuItem>
                  <PopUpMenuItem
                    action={() => signOut(dispatch)}
                    itemClasses="bg-red-500/20 text-red-500 hover:bg-red-500/40 w-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <rect width="24" height="24" fill="none" />
                      <path
                        fill="currentColor"
                        d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h6q.425 0 .713.288T12 4t-.288.713T11 5H5v14h6q.425 0 .713.288T12 20t-.288.713T11 21zm12.175-8H10q-.425 0-.712-.288T9 12t.288-.712T10 11h7.175L15.3 9.125q-.275-.275-.275-.675t.275-.7t.7-.313t.725.288L20.3 11.3q.3.3.3.7t-.3.7l-3.575 3.575q-.3.3-.712.288t-.713-.313q-.275-.3-.262-.712t.287-.688z"
                      />
                    </svg>
                    <p className="text-[1rem] font-semibold flex-shrink-0">
                      Sign Out
                    </p>
                  </PopUpMenuItem>
                </PopUpMenu>
              )}
              {isFocused && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <g fill="none">
                    <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                    <path
                      fill="currentColor"
                      d="M3.636 11.293a1 1 0 0 0 0 1.414l5.657 5.657a1 1 0 0 0 1.414-1.414L6.757 13H20a1 1 0 1 0 0-2H6.757l3.95-3.95a1 1 0 0 0-1.414-1.414z"
                    />
                  </g>
                </svg>
              )}
            </button>
            <Search select={activeSelect} />
          </div>
          {!isFocused && <AsideChatWrapper />}
          <div
            className={`${
              isFocused
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-115 pointer-events-none"
            } transition-all flex flex-col w-full h-[95%] absolute left-0 top-[5%] z-10 bg-[#252525]`}
          >
            <header className="h-[5%] flex border-b-2 border-[#151515] py-2 w-full text-[#ccc] font-semibold">
              <p
                onClick={() => setActiveSelect("chats")}
                className={`px-4 cursor-pointer hover:text-[#8765DC] transition-all ${
                  activeSelect !== "chats" ? "text-[#ccc]" : "text-[#8675DC]"
                }`}
              >
                Chats
              </p>
              <p
                onClick={() => setActiveSelect("messages")}
                className={`px-4 cursor-pointer hover:text-[#8765DC] transition-all ${
                  activeSelect !== "messages" ? "text-[#ccc]" : "text-[#8675DC]"
                }`}
              >
                Messages
              </p>
            </header>
            <p className="text-[#ccc] my-4 px-4 h-[5%]">
              {data?.length > 0 ? "Closest results" : "Search for something"}
            </p>
            <ul className="flex flex-col px-2 overflow-scroll h-[90%]">
              {data?.map((chat, index) => {
                const uniqueKey = chat._id + "-" + index;
                return <AsideChat key={uniqueKey} chat={chat} />;
              })}
            </ul>
          </div>
        </div>
        <ModifyChat
          title="New Channel"
          isModifying={addingChannel}
          setIsModifying={setAddingChannel}
          action={addChat}
          type="add"
        />
      </div>
    </aside>
  );
}
