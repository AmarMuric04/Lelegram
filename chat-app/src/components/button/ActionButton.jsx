import PropTypes from "prop-types";

export default function ActionButton({
  action,
  buttonClasses,
  children,
  ...props
}) {
  return (
    <button
      {...props}
      onClick={action}
      className={`${buttonClasses} text-white p-4 rounded-full bg-[#8675DC] hover:bg-[#8765DC] transition-all cursor-pointer`}
    >
      {children}
    </button>
  );
}

ActionButton.propTypes = {
  action: PropTypes.func,
  buttonClasses: PropTypes.string,
  children: PropTypes.node.isRequired,
};
