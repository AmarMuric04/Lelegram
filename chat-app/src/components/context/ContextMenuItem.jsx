import PropTypes from "prop-types";

export default function ContextMenuItem({
  action,
  icon,
  buttonClasses,
  textClasses,
  children,
}) {
  return (
    <button
      onClick={action}
      className={`flex w-full py-2  px-2 items-center gap-4 rounded-md transition-all cursor-pointer ${
        buttonClasses && buttonClasses
      }`}
    >
      {icon}
      <p className={`${textClasses && textClasses} text-sm font-semibold`}>
        {children}
      </p>
    </button>
  );
}

ContextMenuItem.propTypes = {
  action: PropTypes.func.isRequired,
  icon: PropTypes.node.isRequired,
  buttonClasses: PropTypes.string,
  textClasses: PropTypes.string,
  children: PropTypes.node,
};
