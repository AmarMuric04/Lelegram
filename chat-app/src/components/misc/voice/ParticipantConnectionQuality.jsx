import { useConnectionQualityIndicator } from "@livekit/components-react";
import PropTypes from "prop-types";

export default function ParticipantConnectionQuality({ participant }) {
  const { quality } = useConnectionQualityIndicator(participant);
  return (
    <div className="connection-quality">Connection Quality: {quality}</div>
  );
}

ParticipantConnectionQuality.propTypes = {
  participant: PropTypes.any,
};
