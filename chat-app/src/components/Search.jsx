import { useState } from "react";
import { useDispatch } from "react-redux";
import { setSearch } from "../store/searchSlice";
import { setIsFocused } from "../store/searchSlice";

export default function Search() {
  const [value, setValue] = useState("");

  const CONDITION = value.length < 1;
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const handleSearch = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/chat/get-searched-chats",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ input: value }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Searching failed.");
      }

      dispatch(setSearch(data.data));
      setValue("");

      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <div className="relative flex gap-5 items-center w-[88%] h-full transition-all">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className="absolute text-[#ccc] left-3 pointer-events-none"
      >
        <path
          fill="currentColor"
          d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"
        />
      </svg>
      <input
        value={value}
        onFocus={() => dispatch(setIsFocused(true))}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search"
        type="text"
        className={`border-2 transition-all border-[#202021] focus:border-[#8675DC] pl-[40px] bg-[#202021] text-white h-full rounded-full focus:outline-none ${
          CONDITION ? "w-full" : "w-[83%]"
        }`}
      />
      <button
        onClick={handleSearch}
        className={`absolute transition-all h-full bg-[#8675DC] w-[45px] grid place-items-center rounded-full hover:bg-[#8765DC] cursor-pointer ${
          CONDITION ? "-right-[200px]" : "-right-0"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="text-white"
        >
          <path
            fill="currentColor"
            d="m14 18l-1.4-1.45L16.15 13H4v-2h12.15L12.6 7.45L14 6l6 6z"
          />
        </svg>
      </button>
    </div>
  );
}
