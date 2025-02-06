import PropTypes from "prop-types";

export default function PopUpMenuItem({ itemClasses, action, children }) {
  return (
    <button
      role="menuitem"
      onClick={action}
      className={`${
        itemClasses && itemClasses
      } w-full cursor-pointer flex justify-between gap-2 items-center  transition-all p-2 rounded-md`}
    >
      {children}
    </button>
  );
}

PopUpMenuItem.propTypes = {
  action: PropTypes.func.isRequired,
  icon: PropTypes.node,
  itemClasses: PropTypes.string,
  children: PropTypes.node,
};
