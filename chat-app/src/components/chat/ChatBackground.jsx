import Gradient from "../../assets/gradient.png";
import Image from "../../assets/tg-bg.png";

export default function ChatBackground() {
  return (
    <>
      <img
        className={`min-w-[63.5vw] absolute z-10 pointer-events-none h-full left-0 top-0 object-cover`}
        src={Image}
      />
      <img className="min-w-[63.5vw] absolute z-0 h-screen" src={Gradient} />
      <div className="absolute min-w-[63.5vw] h-screen z-10 opacified-bg"></div>
    </>
  );
}
