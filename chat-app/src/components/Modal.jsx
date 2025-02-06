import PropTypes from "prop-types";
import { useSelector } from "react-redux";

export default function Modal({ children }) {
  const isOpen = useSelector((state) => state.modal.isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 bg-black/50 flex items-center justify-center text-white">
      <div className="popInAnimation bg-[#151515] py-5 px-8 rounded-xl">
        {children}
      </div>
    </div>
  );
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
};
