import PropTypes from "prop-types";
import AsideChat from "./AsideChat";
import { useQuery } from "@tanstack/react-query";

export default function AsideChatWrapper() {
  const token = localStorage.getItem("token");

  const handleGetChats = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/chat/get-user-chats",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Couldn't fetch chats.");
      }

      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const { data: chats, isLoading } = useQuery({
    queryFn: handleGetChats,
    queryKey: ["chats"],
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <ul className="flex flex-col px-2 overflow-scroll h-[95%]">
      {chats?.data?.map((chat, index) => {
        const uniqueKey = chat._id + "-" + index;
        return <AsideChat key={uniqueKey} chat={chat} />;
      })}
    </ul>
  );
}

AsideChatWrapper.propTypes = {
  chats: PropTypes.array,
};
