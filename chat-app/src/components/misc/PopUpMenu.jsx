import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";

export default function PopUpMenu({
  buttonClasses,
  icon,
  iconWhenClicked,
  children,
  tl,
  tr,
  bl,
  br,
}) {
  const [open, setOpen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const unsetOpen = () => setOpen(false);

    const handleMouseMove = (e) => {
      if (!modalRef.current) return;

      const rect = modalRef.current.getBoundingClientRect();
      const elemX = rect.left + rect.width / 2;
      const elemY = rect.top + rect.height / 2;

      const distance = Math.sqrt(
        (e.clientX - elemX) ** 2 + (e.clientY - elemY) ** 2
      );
      if (distance > 300) setOpen(false);
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
  }, [open]);

  return (
    <div role="menu" className="relative">
      <button
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className={buttonClasses}
      >
        {iconWhenClicked && open && iconWhenClicked}
        {iconWhenClicked && !open && icon}
        {!iconWhenClicked && icon}
      </button>
      <div
        ref={modalRef}
        className={`absolute z-50 min-w-max right-0 sidepanel p-2 text-xs theme-text rounded-md
        ${open ? "opacity-100 scale-100" : "opacity-0 scale-0"}
        ${tl ? "bottom-[130%] right-0" : ""}
        ${tr ? "bottom-[130%] left-0" : ""}
        ${bl ? "top-[130%] right-0" : ""}
        ${br ? "top-[130%] left-0" : ""}
        transition-all shadow-md whitespace-nowrap`}
      >
        {children}
      </div>
    </div>
  );
}

PopUpMenu.propTypes = {
  buttonClasses: PropTypes.string,
  children: PropTypes.node,
  br: PropTypes.bool,
  bl: PropTypes.bool,
  tr: PropTypes.bool,
  tl: PropTypes.bool,
  icon: PropTypes.node,
  iconWhenClicked: PropTypes.node,
};
