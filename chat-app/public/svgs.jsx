import PropTypes from "prop-types";

export const CrossSVG = ({ classes, dimensions = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={dimensions}
    height={dimensions}
    className={`${classes && classes}`}
    viewBox="0 0 24 24"
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2"
      d="M20 20L4 4m16 0L4 20"
    />
  </svg>
);

CrossSVG.propTypes = {
  classes: PropTypes.string,
  dimensions: PropTypes.number,
};

export const ReplySVG = ({ classes, dimension = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={dimension}
    height={dimension}
    className={`${classes && classes}`}
    viewBox="0 0 32 32"
  >
    <path
      fill="currentColor"
      d="M28.88 30a1 1 0 0 1-.88-.5A15.19 15.19 0 0 0 15 22v6a1 1 0 0 1-.62.92a1 1 0 0 1-1.09-.21l-12-12a1 1 0 0 1 0-1.42l12-12a1 1 0 0 1 1.09-.21A1 1 0 0 1 15 4v6.11a17.19 17.19 0 0 1 15 17a16 16 0 0 1-.13 2a1 1 0 0 1-.79.86ZM14.5 20A17.62 17.62 0 0 1 28 26a15.31 15.31 0 0 0-14.09-14a1 1 0 0 1-.91-1V6.41L3.41 16L13 25.59V21a1 1 0 0 1 1-1h.54Z"
    />
  </svg>
);

ReplySVG.propTypes = {
  classes: PropTypes.string,
  dimension: PropTypes.number,
};

export const ForwardSVG = ({ classes, dimension = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={dimension}
    height={dimension}
    viewBox="0 0 32 32"
    className={`${classes && classes} -scale-x-100`}
  >
    <path
      fill="currentColor"
      d="M28.88 30a1 1 0 0 1-.88-.5A15.19 15.19 0 0 0 15 22v6a1 1 0 0 1-.62.92a1 1 0 0 1-1.09-.21l-12-12a1 1 0 0 1 0-1.42l12-12a1 1 0 0 1 1.09-.21A1 1 0 0 1 15 4v6.11a17.19 17.19 0 0 1 15 17a16 16 0 0 1-.13 2a1 1 0 0 1-.79.86ZM14.5 20A17.62 17.62 0 0 1 28 26a15.31 15.31 0 0 0-14.09-14a1 1 0 0 1-.91-1V6.41L3.41 16L13 25.59V21a1 1 0 0 1 1-1h.54Z"
    />
  </svg>
);

ForwardSVG.propTypes = {
  classes: PropTypes.string,
  dimension: PropTypes.number,
};

export const EditSVG = ({ classes, dimensions = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={dimensions}
    height={dimensions}
    viewBox="0 0 24 24"
    className={`${classes && classes}`}
  >
    <rect width="24" height="24" fill="none" />
    <path
      fill="currentColor"
      d="M5 19h1.425L16.2 9.225L14.775 7.8L5 17.575zm-1 2q-.425 0-.712-.288T3 20v-2.425q0-.4.15-.763t.425-.637L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.437.65T21 6.4q0 .4-.138.763t-.437.662l-12.6 12.6q-.275.275-.638.425t-.762.15zM19 6.4L17.6 5zm-3.525 2.125l-.7-.725L16.2 9.225z"
    />
  </svg>
);

EditSVG.propTypes = {
  classes: PropTypes.string,
  dimensions: PropTypes.number,
};

export const LeftArrowSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className="text-[#ccc]"
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="m12 19l-7-7l7-7m7 7H5"
    />
  </svg>
);

export const MicrophoneSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3m7 9c0 3.53-2.61 6.44-6 6.93V21h-2v-3.07c-3.39-.49-6-3.4-6-6.93h2a5 5 0 0 0 5 5a5 5 0 0 0 5-5z"
    />
  </svg>
);

export const SendSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M21.243 12.437a.5.5 0 0 0 0-.874l-2.282-1.268A75.5 75.5 0 0 0 4.813 4.231l-.665-.208A.5.5 0 0 0 3.5 4.5v5.75a.5.5 0 0 0 .474.5l1.01.053a44.4 44.4 0 0 1 7.314.998l.238.053c.053.011.076.033.089.05a.16.16 0 0 1 .029.096c0 .04-.013.074-.029.096c-.013.017-.036.039-.089.05l-.238.053a44.5 44.5 0 0 1-7.315.999l-1.01.053a.5.5 0 0 0-.473.499v5.75a.5.5 0 0 0 .65.477l.664-.208a75.5 75.5 0 0 0 14.147-6.064z"
    />
  </svg>
);

export const ThrobberSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M12,23a9.63,9.63,0,0,1-8-9.5,9.51,9.51,0,0,1,6.79-9.1A1.66,1.66,0,0,0,12,2.81h0a1.67,1.67,0,0,0-1.94-1.64A11,11,0,0,0,12,23Z"
    >
      <animateTransform
        attributeName="transform"
        dur="0.75s"
        repeatCount="indefinite"
        type="rotate"
        values="0 12 12;360 12 12"
      />
    </path>
  </svg>
);

export const VerticalDotsSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M12 5.92A.96.96 0 1 0 12 4a.96.96 0 0 0 0 1.92m0 7.04a.96.96 0 1 0 0-1.92a.96.96 0 0 0 0 1.92M12 20a.96.96 0 1 0 0-1.92a.96.96 0 0 0 0 1.92"
    />
  </svg>
);

export const SelectSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 20 20"
  >
    <path
      fill="currentColor"
      d="M2.93 17.07A10 10 0 1 1 17.07 2.93A10 10 0 0 1 2.93 17.07m12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32M6.7 9.29L9 11.6l4.3-4.3l1.4 1.42L9 14.4l-3.7-3.7l1.4-1.42z"
    />
  </svg>
);

export const TrashSVG = ({ classes, dimensions = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={dimensions}
    height={dimensions}
    className={`${classes && classes}`}
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M16 9v10H8V9zm-1.5-6h-5l-1 1H5v2h14V4h-3.5zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2z"
    />
  </svg>
);

TrashSVG.propTypes = {
  classes: PropTypes.string,
  dimensions: PropTypes.number,
};

export const ArrowUpSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M11 4h2v12l5.5-5.5l1.42 1.42L12 19.84l-7.92-7.92L5.5 10.5L11 16z"
    />
  </svg>
);

export const ClipSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
  >
    <rect width="20" height="20" fill="none" />
    <path
      fill="currentColor"
      d="M3.264 8.579a.683.683 0 0 1-.975 0a.704.704 0 0 1 0-.987L8.32 1.5C9.68.444 11.048-.063 12.41.006c1.716.088 3.052.742 4.186 1.815C17.752 2.915 18.5 4.476 18.5 6.368c0 1.452-.422 2.73-1.313 3.864l-8.503 8.76c-.86.705-1.816 1.046-2.84 1.005c-1.3-.054-2.267-.474-2.986-1.185c-.842-.831-1.358-1.852-1.358-3.225c0-1.092.377-2.1 1.155-3.046L10.139 4.9c.6-.64 1.187-1.02 1.787-1.112a2.49 2.49 0 0 1 2.2.755c.532.563.76 1.265.68 2.064c-.055.545-.278 1.047-.688 1.528l-6.88 7.048a.683.683 0 0 1-.974.006a.704.704 0 0 1-.006-.987l6.847-7.012c.2-.235.305-.472.33-.724c.04-.4-.056-.695-.305-.958a1.12 1.12 0 0 0-1-.34c-.243.037-.583.258-1.002.704l-7.453 7.607c-.537.655-.797 1.35-.797 2.109c0 .954.345 1.637.942 2.226c.475.47 1.12.75 2.08.79c.68.027 1.31-.198 1.858-.642l8.397-8.65c.645-.827.967-1.8.967-2.943c0-1.482-.577-2.684-1.468-3.528c-.91-.862-1.95-1.37-3.313-1.44c-1.008-.052-2.065.34-3.117 1.146z"
    />
  </svg>
);

export const PhotoSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
  >
    <rect width="24" height="24" fill="none" />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M2 5a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v6.5a1 1 0 0 1-.032.25A1 1 0 0 1 22 12v7a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-3a1 1 0 0 1 .032-.25A1 1 0 0 1 2 15.5zm2.994 9.83q-.522.01-.994.046V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v6.016c-4.297.139-7.4 1.174-9.58 2.623c.826.293 1.75.71 2.656 1.256c1.399.84 2.821 2.02 3.778 3.583a1 1 0 1 1-1.706 1.044c-.736-1.203-1.878-2.178-3.102-2.913c-1.222-.734-2.465-1.192-3.327-1.392a15.5 15.5 0 0 0-3.703-.386h-.022zm1.984-8.342A2.67 2.67 0 0 1 8.5 6c.41 0 1.003.115 1.522.488c.57.41.978 1.086.978 2.012s-.408 1.601-.978 2.011A2.67 2.67 0 0 1 8.5 11c-.41 0-1.003-.115-1.522-.489C6.408 10.101 6 9.427 6 8.5c0-.926.408-1.601.978-2.012"
      clipRule="evenodd"
    />
  </svg>
);

export const PollSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
  >
    <rect width="24" height="24" fill="none" />
    <path
      fill="currentColor"
      d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H5V5h14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"
    />
  </svg>
);

export const CopySelectedSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
  >
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 11c0-2.828 0-4.243.879-5.121C7.757 5 9.172 5 12 5h3c2.828 0 4.243 0 5.121.879C21 6.757 21 8.172 21 11v5c0 2.828 0 4.243-.879 5.121C19.243 22 17.828 22 15 22h-3c-2.828 0-4.243 0-5.121-.879C6 20.243 6 18.828 6 16z" />
      <path d="M6 19a3 3 0 0 1-3-3v-6c0-3.771 0-5.657 1.172-6.828S7.229 2 11 2h4a3 3 0 0 1 3 3" />
    </g>
  </svg>
);

export const PinSVG = ({ classes, dimensions = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={dimensions}
    height={dimensions}
    viewBox="0 0 16 16"
    className={`${classes && classes}`}
  >
    <rect width="16" height="16" fill="none" />
    <path
      fill="currentColor"
      d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479c-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A6 6 0 0 1 5 6.708V2.277a3 3 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354m1.58 1.408l-.002-.001zm-.002-.001l.002.001A.5.5 0 0 1 6 2v5a.5.5 0 0 1-.276.447h-.002l-.012.007l-.054.03a5 5 0 0 0-.827.58c-.318.278-.585.596-.725.936h7.792c-.14-.34-.407-.658-.725-.936a5 5 0 0 0-.881-.61l-.012-.006h-.002A.5.5 0 0 1 10 7V2a.5.5 0 0 1 .295-.458a1.8 1.8 0 0 0 .351-.271c.08-.08.155-.17.214-.271H5.14q.091.15.214.271a1.8 1.8 0 0 0 .37.282"
    />
  </svg>
);

PinSVG.propTypes = {
  classes: PropTypes.string,
  dimensions: PropTypes.number,
};

export const UnpinSVG = ({ classes, dimensions = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={dimensions}
    height={dimensions}
    viewBox="0 0 24 24"
    className={`${classes && classes}`}
  >
    <rect width="24" height="24" fill="none" />
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 17v5m3-12.66V7a1 1 0 0 1 1-1a2 2 0 0 0 0-4H7.89M2 2l20 20M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11"
    />
  </svg>
);

UnpinSVG.propTypes = {
  classes: PropTypes.string,
  dimensions: PropTypes.number,
};

export const FlagSVG = ({ classes, dimensions = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={dimensions}
    height={dimensions}
    viewBox="0 0 24 24"
    className={`${classes && classes}`}
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M4 21v-5.313m0 0c5.818-4.55 10.182 4.55 16 0V4.313c-5.818 4.55-10.182-4.55-16 0z"
    />
  </svg>
);

FlagSVG.propTypes = {
  classes: PropTypes.string,
  dimensions: PropTypes.number,
};

export const LinkSVG = ({ classes, dimensions = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={dimensions}
    height={dimensions}
    viewBox="0 0 24 24"
    className={`${classes && classes}`}
  >
    <path
      fill="currentColor"
      d="M13.293 3.96a4.771 4.771 0 1 1 6.747 6.747l-3.03 3.03l-1.415-1.413l3.03-3.031a2.771 2.771 0 1 0-3.918-3.92l-3.031 3.031l-1.414-1.414zm2.12 6.04l-5.415 5.414L8.584 14l5.414-5.414zm-7.01 1.676l-3.03 3.031a2.771 2.771 0 1 0 3.92 3.92l3.03-3.031l1.414 1.414l-3.03 3.03a4.771 4.771 0 1 1-6.748-6.747l3.03-3.03z"
    />
  </svg>
);

LinkSVG.propTypes = {
  classes: PropTypes.string,
  dimensions: PropTypes.number,
};

export const LightbulbSVG = ({ classes, dimensions = 20 }) => (
  <svg
    className={`${classes && classes}`}
    xmlns="http://www.w3.org/2000/svg"
    width={dimensions}
    height={dimensions}
    viewBox="0 0 24 24"
  >
    <rect width="24" height="24" fill="none" />
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      color="currentColor"
    >
      <path d="M5.143 14A7.8 7.8 0 0 1 4 9.919C4 5.545 7.582 2 12 2s8 3.545 8 7.919A7.8 7.8 0 0 1 18.857 14" />
      <path d="M14 10c-.613.643-1.289 1-2 1s-1.387-.357-2-1m-2.617 7.098c-.092-.276-.138-.415-.133-.527a.6.6 0 0 1 .382-.53c.104-.041.25-.041.54-.041h7.656c.291 0 .436 0 .54.04a.6.6 0 0 1 .382.531c.005.112-.041.25-.133.527c-.17.511-.255.767-.386.974a2 2 0 0 1-1.2.869c-.238.059-.506.059-1.043.059h-3.976c-.537 0-.806 0-1.043-.06a2 2 0 0 1-1.2-.868c-.131-.207-.216-.463-.386-.974M15 19l-.13.647c-.14.707-.211 1.06-.37 1.34a2 2 0 0 1-1.113.912C13.082 22 12.72 22 12 22s-1.082 0-1.387-.1a2 2 0 0 1-1.113-.913c-.159-.28-.23-.633-.37-1.34L9 19m3-3.5V11" />
    </g>
  </svg>
);

LightbulbSVG.propTypes = {
  classes: PropTypes.string,
  dimensions: PropTypes.number,
};

export const CheckmarkSVG = ({ classes, dimensions = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={dimensions}
    height={dimensions}
    viewBox="0 0 32 32"
    className={`${classes && classes}`}
  >
    <rect width="32" height="32" fill="none" />
    <path
      fill="currentColor"
      d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2m-2 19.59l-5-5L10.59 15L14 18.41L21.41 11l1.596 1.586Z"
    />
    <path
      fill="none"
      d="m14 21.591l-5-5L10.591 15L14 18.409L21.41 11l1.595 1.585z"
    />
  </svg>
);

CheckmarkSVG.propTypes = {
  classes: PropTypes.string,
  dimensions: PropTypes.number,
};

export const IncorrectSVG = ({ classes, dimensions = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={dimensions}
    height={dimensions}
    viewBox="0 0 15 15"
    className={`${classes && classes}`}
  >
    <rect width="15" height="15" fill="none" />
    <path
      fill="currentColor"
      d="M3.64 2.27L7.5 6.13l3.84-3.84A.92.92 0 0 1 12 2a1 1 0 0 1 1 1a.9.9 0 0 1-.27.66L8.84 7.5l3.89 3.89A.9.9 0 0 1 13 12a1 1 0 0 1-1 1a.92.92 0 0 1-.69-.27L7.5 8.87l-3.85 3.85A.92.92 0 0 1 3 13a1 1 0 0 1-1-1a.9.9 0 0 1 .27-.66L6.16 7.5L2.27 3.61A.9.9 0 0 1 2 3a1 1 0 0 1 1-1c.24.003.47.1.64.27"
    />
  </svg>
);

IncorrectSVG.propTypes = {
  classes: PropTypes.string,
  dimensions: PropTypes.number,
};

export const PenSVG = ({ classes, dimensions = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={dimensions}
    height={dimensions}
    className={`${classes && classes}`}
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M3 21v-4.25L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.438.65T21 6.4q0 .4-.137.763t-.438.662L7.25 21zM17.6 7.8L19 6.4L17.6 5l-1.4 1.4z"
    />
  </svg>
);

PenSVG.propTypes = {
  classes: PropTypes.string,
  dimensions: PropTypes.number,
};

export const MegaphoneSVG = ({ classes, dimensions = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={dimensions}
    height={dimensions}
    className={`${classes && classes}`}
    viewBox="0 0 24 24"
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      d="M14 14V6m0 8l6.102 3.487a.6.6 0 0 0 .898-.52V3.033a.6.6 0 0 0-.898-.521L14 6m0 8H7a4 4 0 1 1 0-8h7M7.757 19.3L7 14h4l.677 4.74a1.98 1.98 0 0 1-3.92.56Z"
    />
  </svg>
);

MegaphoneSVG.propTypes = {
  classes: PropTypes.string,
  dimensions: PropTypes.number,
};
