import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import { closeContextMenu } from "../../store/redux/contextMenuSlice";
import { useEffect, useRef } from "react";

export default function ContextMenu({ children }) {
  const dispatch = useDispatch();
  const { open, contextMenuInfo } = useSelector((state) => state.contextMenu);
  const modalRef = useRef(null);

  useEffect(() => {
    const unsetOpen = () => {
      dispatch(closeContextMenu());
    };

    const handleMouseMove = (e) => {
      if (!modalRef.current) return;

      const rect = modalRef.current.getBoundingClientRect();
      const elemX = rect.left + rect.width / 2;
      const elemY = rect.top + rect.height / 2;

      const distance = Math.sqrt(
        (e.clientX - elemX) ** 2 + (e.clientY - elemY) ** 2
      );
      if (distance > 200) {
        dispatch(closeContextMenu());
      }
    };

    if (open) {
      const timeout = setTimeout(() => {
        document.body.addEventListener("click", unsetOpen);
        document.addEventListener("mousemove", handleMouseMove);
      }, 10);

      return () => {
        clearTimeout(timeout);
        document.body.removeEventListener("click", unsetOpen);
        document.removeEventListener("mousemove", handleMouseMove);
      };
    }

    return () => {
      document.body.removeEventListener("click", unsetOpen);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [open, dispatch]);

  useEffect(() => {
    const handleClickOutside = () => {
      dispatch(closeContextMenu());
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [dispatch]);

  if (!open || !contextMenuInfo) return null;

  return ReactDOM.createPortal(
    <div
      ref={modalRef}
      className="appearAnimation text-white bg-[#202021] rounded-xl shadow-md"
      style={{
        position: "absolute",
        top: contextMenuInfo.y,
        left: contextMenuInfo.x,
        padding: "10px",
        zIndex: 1000,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>,
    document.body
  );
}

ContextMenu.propTypes = {
  children: PropTypes.node.isRequired,
};
