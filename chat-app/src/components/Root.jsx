import { Outlet } from "react-router-dom";
import PrivateRoute from "./misc/PrivateRoute";
import { CrossSVG } from "../../public/svgs";
import { useState } from "react";

export default function Root() {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const LOCAL_STORAGE_KEY = "closedNotificationTimestamp";

  const getInitialNotificationState = () => {
    const storedTimestamp = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedTimestamp) {
      const timestamp = parseInt(storedTimestamp, 10);
      if (!isNaN(timestamp) && Date.now() - timestamp < ONE_DAY_MS) {
        return true;
      }
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    return false;
  };

  const [closedNotification, setClosedNotification] = useState(
    getInitialNotificationState
  );

  const handleClose = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, Date.now().toString());
    setClosedNotification(true);
  };

  return (
    <PrivateRoute>
      {!closedNotification && (
        <div
          className="popInAnimation absolute bg-gray-700 top-8 left-1/2 transform -translate-x-1/2 w-11/12 md:w-1/2 rounded-lg z-50 shadow-lg"
          role="alert"
          aria-live="assertive"
        >
          <div className="relative flex flex-col gap-4 text-white p-4">
            <button
              onClick={handleClose}
              type="button"
              aria-label="Close notification"
              className="self-end transition-all p-2 rounded-full cursor-pointer hover:bg-[#ffffff50]"
            >
              <CrossSVG />
            </button>
            <p className="text-sm">
              Note: The backend of this project is deployed on Render. If this
              is your first visit, the initial interaction may take 30–60
              seconds. After that, you’ll enjoy a smooth experience.
            </p>
          </div>
        </div>
      )}
      <Outlet />
    </PrivateRoute>
  );
}
