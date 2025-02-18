import LeaveChatModal from "../chat/LeaveChatModal";
import ForwardMessageModal from "../message/ForwardMessageModal";
import DeleteMessageModal from "../message/DeleteMessageModal";
import ImageModal from "../message/ImageModal";
import PollModal from "../poll/PollModal";

export default function ConditionalModals() {
  return (
    <>
      <LeaveChatModal />
      <ForwardMessageModal />
      <DeleteMessageModal />
      <ImageModal />
      <PollModal />
    </>
  );
}
