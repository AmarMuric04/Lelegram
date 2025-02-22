import { useDispatch, useSelector } from "react-redux";
import { handlePostInput } from "../../utility/util";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Input from "../misc/Input";
import { LeftArrowSVG, TrashSVG } from "../../../public/svgs";
import { setImage } from "../../store/redux/imageSlice";
import { openModal } from "../../store/redux/modalSlice";

export default function ModifyTab({
  setIsModifying,
  action,
  title,
  type,
  victimData,
}) {
  const { url, preview } = useSelector((state) => state.image);
  const dispatch = useDispatch();
  const [victimChanges, setVictimChanges] = useState({ ...victimData });

  function formatLabel(text) {
    return text
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  if (type === "edituser") console.log(victimData);

  useEffect(() => {
    if (victimData.imageUrl) {
      dispatch(setImage({ url: victimData.imageUrl }));
    }
  }, [type, victimData, dispatch]);

  const isDifferent = Object.keys(victimData).some((key) => {
    if (key === "imageUrl") {
      return url !== victimData.imageUrl;
    }
    return victimData[key] !== victimChanges[key];
  });

  const isEmpty = Object.keys(victimChanges).some(
    (key) => victimChanges[key] === ""
  );

  let btnCondition =
    type === "edit"
      ? isDifferent && !isEmpty
        ? "bottom-5"
        : "-bottom-20"
      : "-bottom-20";

  const handleFieldChange = (field, value) => {
    setVictimChanges((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-w-full theme-text theme-bg h-full min-h-screen relative">
      <div className="sidepanel px-8 py-4">
        <div className="flex items-center text-white text-xl font-semibold gap-8">
          <button
            className="cursor-pointer"
            onClick={() => setIsModifying(false)}
          >
            <LeftArrowSVG />
          </button>
          <p>{title}</p>
        </div>
        <div className="flex items-center flex-col">
          <div className="relative bg-[#8675DC] hover:bg-[#8765DC] h-32 w-32 text-white rounded-full my-12 group cursor-pointer">
            {preview && (
              <img
                className="w-full h-full rounded-full object-cover absolute"
                src={preview}
                alt="Chosen profile picture."
              />
            )}
            {!preview && victimData?.imageUrl && (
              <img
                className="w-full h-full rounded-full object-cover absolute"
                src={`${import.meta.env.VITE_SERVER_PORT}/${
                  victimData.imageUrl
                }`}
                alt="Chosen profile picture."
              />
            )}
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="45"
                height="45"
                viewBox="0 0 24 24"
                className="group-hover:scale-120 transition-all"
              >
                <path
                  fill="currentColor"
                  d="M3 21q-.825 0-1.412-.587T1 19V7q0-.825.588-1.412T3 5h3.15L7.4 3.65q.275-.3.663-.475T8.875 3H13q.425 0 .713.288T14 4t-.288.713T13 5H8.875L7.05 7H3v12h16v-8q0-.425.288-.712T20 10t.713.288T21 11v8q0 .825-.587 1.413T19 21zM19 5h-1q-.425 0-.712-.288T17 4t.288-.712T18 3h1V2q0-.425.288-.712T20 1t.713.288T21 2v1h1q.425 0 .713.288T23 4t-.288.713T22 5h-1v1q0 .425-.288.713T20 7t-.712-.288T19 6zm-8 12.5q1.875 0 3.188-1.312T15.5 13t-1.312-3.187T11 8.5T7.813 9.813T6.5 13t1.313 3.188T11 17.5m0-2q-1.05 0-1.775-.725T8.5 13t.725-1.775T11 10.5t1.775.725T13.5 13t-.725 1.775T11 15.5"
                />
              </svg>
            </div>
            <input
              onChange={(e) =>
                handlePostInput(e.target.value, e.target.files, dispatch)
              }
              type="file"
              className="h-full w-full opacity-0 cursor-pointer"
            />
          </div>
          <div className="flex flex-col gap-4 w-full">
            {Object.entries(victimChanges).map(([key, value]) => {
              if (key === "imageUrl") return null;
              let label = key;
              return (
                <Input
                  key={key}
                  value={value}
                  textClass="sidepanel"
                  inputValue={value}
                  name={key}
                  onChange={(e) => handleFieldChange(key, e.target.value)}
                  type="text"
                >
                  {formatLabel(label)}
                </Input>
              );
            })}
          </div>
        </div>
      </div>
      <p className="theme-text-2 text-sm text-center my-2">
        You can provide an optional description for your channel.
      </p>
      {type === "edit" && (
        <div className="sidepanel p-4">
          <button
            onClick={() => dispatch(openModal("leave-channel"))}
            className="flex w-full items-center gap-8 cursor-pointer transition-all text-red-400 hover:bg-red-500/10 p-4 rounded-lg"
          >
            <TrashSVG dimensions={24} />
            <p>Delete Channel</p>
          </button>
        </div>
      )}
      <div className={`absolute z-50 right-5 transition-all ${btnCondition}`}>
        <button
          onClick={() => {
            action({ data: { ...victimChanges, url, preview } });
            setIsModifying(false);
          }}
          className="bg-[#8675DC] cursor-pointer hover:bg-[#8765DC] transition-all p-4 text-white rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 512 512"
            className="theme-text-2"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="square"
              strokeMiterlimit="10"
              strokeWidth="44"
              d="M416 128L192 384l-96-96"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

ModifyTab.propTypes = {
  setIsModifying: PropTypes.func.isRequired,
  action: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  victimData: PropTypes.object.isRequired,
};
