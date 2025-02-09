import PropTypes from "prop-types";
import { useSelector } from "react-redux";

export default function Modal({ children, extraClasses, id }) {
  const isOpen = useSelector((state) => state.modal.isOpen);

  if (isOpen !== id) return null;

  return (
    <div className="fixed z-50 inset-0 bg-black/50 flex items-center justify-center text-white">
      <div
        className={`popInAnimation bg-[#151515] py-5 px-8 rounded-xl ${
          extraClasses && extraClasses
        }`}
      >
        {children}
      </div>
    </div>
  );
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
  extraClasses: PropTypes.string,
};
