import PropTypes from "prop-types";

export default function Checkbox({ action, isChecked, extraText, name }) {
  return (
    <div className="cb4 flex">
      <input
        onChange={action}
        checked={isChecked}
        className="inp-cbx"
        id={name}
        type="checkbox"
      />
      <label className="cbx" htmlFor={name}>
        <span>
          <svg width="12px" height="10px">
            <use xlinkHref="#check-4"></use>
          </svg>
        </span>
        <span className="ml-4">{extraText}</span>
      </label>
    </div>
  );
}

Checkbox.propTypes = {
  action: PropTypes.func,
  isChecked: PropTypes.bool.isRequired,
  extraText: PropTypes.string,
  name: PropTypes.string.isRequired,
};
