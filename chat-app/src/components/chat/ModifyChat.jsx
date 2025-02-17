import { useSelector } from "react-redux";
import { handlePostInput } from "../../utility/util";
import PropTypes from "prop-types";
import { useState } from "react";
import Input from "../Input";
import { LeftArrowSVG } from "../../../public/svgs";

export default function ModifyChat({
  isModifying,
  setIsModifying,
  action,
  title,
  type,
}) {
  const { activeChat } = useSelector((state) => state.chat);

  const [chat, setChat] = useState({
    url: "",
    name: "",
    description: "",
    preview: null,
  });

  const isNameDifferent = chat.name !== activeChat?.name && chat.name !== "";
  const isDescDifferent =
    chat.description !== activeChat?.description && chat.description !== "";

  let btnCondition;
  if (type === "edit")
    btnCondition =
      isNameDifferent || isDescDifferent ? "bottom-5" : "-bottom-20";
  else if (type === "add")
    btnCondition = chat.name && chat.description ? "bottom-5" : "-bottom-20";

  return (
    <div
      className={`min-w-full h-full min-h-screen absolute text-white transition-all bg-[#202021] ${
        isModifying ? (type === "edit" ? "left-0" : "left-full") : "left-full"
      }`}
    >
      <div className="bg-[#242424] px-8 py-4">
        <div className="flex items-center text-white text-xl font-semibold gap-8">
          <button
            className="cursor-pointer"
            onClick={() => setIsModifying(false)}
          >
            <LeftArrowSVG />
          </button>
          <p>{title}</p>
        </div>
        <div className="flex items-center flex-col">
          <div className="relative bg-[#8675DC] hover:bg-[#8765DC] h-32 w-32 text-white rounded-full my-12 group cursor-pointer">
            {chat.imagePreview && (
              <img
                className="w-full h-full rounded-full object-cover absolute"
                src={chat.imagePreview}
                alt="Chosen profile picture."
              />
            )}
            {activeChat?.imageUrl && !chat.imagePreview && (
              <img
                className="w-full h-full rounded-full object-cover absolute"
                src={`http://localhost:3000/${activeChat?.imageUrl}`}
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
                handlePostInput(e.target.value, e.target.files, setChat, chat)
              }
              type="file"
              className="h-full w-full opacity-0 cursor-pointer"
            />
          </div>
          <div className="flex flex-col gap-4 w-full">
            <Input
              value={chat.name}
              textClass={"bg-[#242424]"}
              inputValue={chat.name}
              onChange={(e) => setChat({ ...chat, name: e.target.value })}
              type="text"
            >
              Channel name
            </Input>

            <Input
              value={chat.description}
              textClass={"bg-[#242424]"}
              inputValue={chat.description}
              onChange={(e) =>
                setChat({ ...chat, description: e.target.value })
              }
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
      <div className={`absolute z-50 right-5 transition-all ${btnCondition}`}>
        <button
          onClick={() => action({ chat: chat })}
          className="bg-[#8675DC] cursor-pointer hover:bg-[#8765DC] transition-all p-4 text-white rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 512 512"
            className="text-[#ccc]"
          >
            <rect width="512" height="512" fill="none" />
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="square"
              strokeMiterlimit="10"
              strokeWidth="44"
              d="M416 128L192 384l-96-96"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

ModifyChat.propTypes = {
  isModifying: PropTypes.bool.isRequired,
  setIsModifying: PropTypes.func.isRequired,
  action: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  containerLogic: PropTypes.any,
  type: PropTypes.string.isRequired,
};
