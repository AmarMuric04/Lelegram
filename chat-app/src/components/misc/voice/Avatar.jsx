import { useParticipants } from "@livekit/components-react";

export default function Avatar({ image }) {
  const participants = useParticipants();
  const baseSize = 160;
  const sizeDecrement = 20;
  const minSize = 80;

  const calculatedSize = Math.max(
    minSize,
    baseSize - (participants.length - 1) * sizeDecrement
  );

  return (
    <img
      src={image}
      style={{
        width: `${calculatedSize}px`,
        height: `${calculatedSize}px`,
        objectFit: "cover",
        borderRadius: "50%",
      }}
      className="relative z-20 transition-all duration-500"
    />
  );
}
