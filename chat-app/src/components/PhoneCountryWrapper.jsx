import CountryInput from "./CountryInput";

import PhoneNumberInput from "./PhoneNumberInput";
import { useState } from "react";

export default function PhoneCountryWrapper() {
  const [selected, setSelected] = useState({});

  return (
    <div className="flex gap-4 flex-col w-full">
      <div className="mt-8 w-full">
        <CountryInput selected={selected} setSelected={setSelected} />
      </div>
      <div className="mb-8 w-full">
        <PhoneNumberInput selected={selected} setSelected={setSelected} />
      </div>
    </div>
  );
}
