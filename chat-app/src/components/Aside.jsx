import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import PopUpMenu from "./PopUpMenu";
import PopUpMenuItem from "./PopUpMenuItem";
import Input from "./Input";
import Search from "./Search";
import AsideChatWrapper from "./AsideChatWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setIsFocused, setSearch } from "../store/searchSlice";
import AsideChat from "./AsideChat";
import { handlePostInput } from "../utility/util";

export default function Aside() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const [activeSelect, setActiveSelect] = useState("chats");
  const [addChannel, setAddChannel] = useState(false);

  const { isFocused } = useSelector((state) => state.search);
  const { data } = useSelector((state) => state.search);
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const handleCreateChat = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", desc);
      formData.append("imageUrl", imageUrl);

      const response = await fetch("http://localhost:3000/chat/create-chat", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      });
      const data = await response.json();

      setAddChannel(false);
      setName("");
      setDesc("");

      queryClient.invalidateQueries(["userData"]);

      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <aside
      className={`border-l-2 transition overflow-hidden border-[#151515] w-[25%] relative flex`}
    >
      <div
        className={`w-full flex relative transition-all ${
          addChannel ? "-left-full" : "left-0"
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
              icon={
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
              }
              iconWhenClicked={
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
              }
              buttonClasses={
                "bg-[#8675DC] cursor-pointer hover:bg-[#8765DC] transition-all p-4 text-white rounded-full"
              }
            >
              <PopUpMenuItem action={() => setAddChannel(true)}>
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
              </PopUpMenuItem>
            </PopUpMenu>
          </div>
          <div className="text-white flex justify-between items-center py-2 px-5 h-[58px]">
            <button
              onClick={() => {
                dispatch(setIsFocused(false));
                dispatch(setSearch([]));
              }}
              className="hover:bg-[#303030] cursor-pointer transition-all p-2 text-[#ccc] rounded-full"
            >
              {!isFocused && (
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
          {isFocused && (
            <div className="flex flex-col w-full">
              <header className="flex border-b-2 border-[#151515] py-2 w-full text-[#ccc] font-semibold">
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
                    activeSelect !== "messages"
                      ? "text-[#ccc]"
                      : "text-[#8675DC]"
                  }`}
                >
                  Messages
                </p>
              </header>
              <p className="text-[#ccc] my-4 px-4">
                {data?.length > 0 ? "Closest results" : "Search for something"}{" "}
              </p>
              <ul className="flex flex-col">
                {data?.map((chat, index) => {
                  const uniqueKey = chat._id + "-" + index;
                  return <AsideChat key={uniqueKey} chat={chat} />;
                })}
              </ul>
            </div>
          )}
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
              <div className="relative bg-[#8675DC] hover:bg-[#8765DC] h-32 w-32 text-white rounded-full my-12 group cursor-pointer">
                {imagePreview && (
                  <img
                    className="w-full h-full rounded-full object-cover absolute"
                    src={imagePreview}
                    alt="Chosen profile picture."
                  />
                )}
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="45"
                    height="45"
                    viewBox="0 0 24 24"
                    className="group-hover:scale-120 transition-all"
                  >
                    <path
                      fill="currentColor"
                      d="M3 21q-.825 0-1.412-.587T1 19V7q0-.825.588-1.412T3 5h3.15L7.4 3.65q.275-.3.663-.475T8.875 3H13q.425 0 .713.288T14 4t-.288.713T13 5H8.875L7.05 7H3v12h16v-8q0-.425.288-.712T20 10t.713.288T21 11v8q0 .825-.587 1.413T19 21zM19 5h-1q-.425 0-.712-.288T17 4t.288-.712T18 3h1V2q0-.425.288-.712T20 1t.713.288T21 2v1h1q.425 0 .713.288T23 4t-.288.713T22 5h-1v1q0 .425-.288.713T20 7t-.712-.288T19 6zm-8 12.5q1.875 0 3.188-1.312T15.5 13t-1.312-3.187T11 8.5T7.813 9.813T6.5 13t1.313 3.188T11 17.5m0-2q-1.05 0-1.775-.725T8.5 13t.725-1.775T11 10.5t1.775.725T13.5 13t-.725 1.775T11 15.5"
                    />
                  </svg>
                </div>
                <input
                  onChange={(e) =>
                    handlePostInput(
                      e.target.value,
                      e.target.files,
                      setImagePreview,
                      setImageUrl
                    )
                  }
                  type="file"
                  className="h-full w-full opacity-0 cursor-pointer"
                />
              </div>
              <div className="flex flex-col gap-4 w-full">
                <Input
                  value={name}
                  textClass={"bg-[#242424]"}
                  inputValue={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                >
                  Channel name
                </Input>

                <Input
                  value={desc}
                  textClass={"bg-[#242424]"}
                  inputValue={desc}
                  onChange={(e) => setDesc(e.target.value)}
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
    </aside>
  );
}
