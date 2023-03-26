import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ReactComponent as RightArrowIcon } from "./../assets/arrow-right.svg";
import CircleWithText from "./custom/CircleWithText";
import axios from "axios";
import Tooltip from "@mui/material/Tooltip";
import Carousel from "react-material-ui-carousel";

function ScoreDetailModal({ originLocation, destinations }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
    fetchOverallSavedScore();
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const [savedScores, setSavedScores] = useState({});

  const defaultSavedScores = {
    overall: 0,
    rushHour: 0,
    offPeak: 0,
    weekend: 0,
    overnight: 0,
  };

  const [activeScoreTime, setActiveScoreTime] = useState("Overall");

  const handleActiveScoreTime = (event) => {
    setActiveScoreTime(event.currentTarget.id);
    event.stopPropagation();
  };

  const addColorsToScores = (allScores) => {
    // Convert a hue value (in degrees) to a hex RGB representation
    // Hue in this case refers to the H of an HSV value where S and V are set to 100%
    function hueToHex(hue) {
      let quotient = (hue / 60) >> 0;
      let remainder = (hue % 60) / 60;
      let r, g, b;

      switch (quotient) {
        case 0: // 0-59deg
          r = 255;
          g = Math.round(255 * remainder);
          b = 0;
          break;
        case 1: // 60-119deg
          r = Math.round(255 - 255 * remainder);
          g = 255;
          b = 0;
          break;
        case 2: // 120-179deg
          r = 0;
          g = 255;
          b = Math.round(255 * remainder);
          break;
        case 3: // 180-239deg
          r = 0;
          g = Math.round(255 - 255 * remainder);
          b = 255;
          break;
        case 4: // 240-299deg
          r = Math.round(255 * remainder);
          g = 0;
          b = 255;
          break;
        case 5: // 300-359deg
          r = 255;
          g = 0;
          b = Math.round(255 - 255 * remainder);
          break;
      }

      // Convert the RGB set into its hex representation
      const hex =
        "#" +
        [r, g, b]
          .map((x) => {
            const hex = x.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
          })
          .join("");

      return hex;
    }

    const hueLowerBound = 310;
    const hueUpperBound = 160;
    const hueDirection = 1; // 1 = CW; -1 = CCW
    let hueScale;

    // (x*i+y): x*100+y = upper bound and y = lower bound
    if (hueDirection === 1) {
      hueScale = ((hueUpperBound + 360 - hueLowerBound) % 360) / 100;
    } else {
      hueScale = ((hueLowerBound + 360 - hueUpperBound) % 360) / -100;
    }

    let scores;
    // Deep copy of the scores from the location object
    scores = JSON.parse(JSON.stringify(allScores));
    // Append the corresponding colors to each score value (overall, rushHour, etc)
    for (let score in scores) {
      const i = scores[score];
      let hue = (hueScale * i + hueLowerBound) % 360;
      if (hue < 0) {
        hue += 360;
      }
      scores[`${score}Color`] = hueToHex(hue);
    }

    return scores;
  };

  const fetchOverallSavedScore = () => {
    axios
      .get(`http://localhost:5000/savedScores/${originLocation._id}`)
      .then((response) => {
        if (response.data) {
          let processedScores = addColorsToScores(response.data);
          setSavedScores(processedScores);
        } else {
          // Assign 0 to all scores and statistics if values have not been calculated yet
          let processedScores = addColorsToScores(defaultSavedScores);
          setSavedScores(processedScores);
        }
      })
      .catch((err) => console.error(err));
  };

  let selectedDestination = "default";

  const onChangeDestinationDropdown = (event) => {
    selectedDestination = event.target.value;

    // Reset the selected score time to Overall
    setActiveScoreTime("Overall");

    // Case where selected item in dropdown is All destinations
    if (selectedDestination === "default") {
      fetchOverallSavedScore();
    } else {
      
      // Fetch the saved scores for a specific destination
      axios
        .get(
          `http://localhost:5000/savedScores/${originLocation._id}/${selectedDestination}`
        )
        .then((response) => {
          if (response.data) {
            let processedScores = addColorsToScores(response.data);
            setSavedScores(processedScores);
          } else {
            // Assign 0 to all scores and statistics if values have not been calculated yet
            let processedScores = addColorsToScores(defaultSavedScores);
            setSavedScores(processedScores);
          }
        })
        .catch((err) => console.error(err));

      
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        type="button"
        className="w-8 h-7 flex items-center justify-center transition ease-in-out font-semibold border-b border-emerald-600 rounded-t-lg text-md bg-emerald-200 focus:ring-4 focus:ring-emerald-400 text-emerald-800 dark:text-emerald-dark hover:bg-white"
        on={1}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
          />
        </svg>
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0  bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {/* Contents of the modal */}
              <Dialog.Panel className="inline-block w-full max-w-fit  p-8 my-8 overflow-hidden text-left align-middle transition-all transform bg-emerald-50 shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-3xl py-2.5 font-medium leading-6 text-emerald-500 pl-5 "
                >
                  <div className="flex">
                    <div className="inline flex flex-row">Details</div>

                    <Tooltip
                      title={
                        <table className="table-auto border-separate">
                          <thead>
                            <tr>
                              <th>Transit Score Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>90-100</td>
                              <td>Rider's Paradise</td>
                            </tr>
                            <tr>
                              <td>70-89</td>
                              <td>Excellent Transit</td>
                            </tr>
                            <tr>
                              <td>50-69</td>
                              <td>Good Transit</td>
                            </tr>
                            <tr>
                              <td>25-49</td>
                              <td>Some Transit</td>
                            </tr>
                            <tr>
                              <td>0-24</td>
                              <td>Minimal Transit</td>
                            </tr>
                          </tbody>
                        </table>
                      }
                      placement="right"
                      className="pl-3"
                    >
                      <button
                        type="button"
                        className="w-8 h-8 items-center justify-center transition ease-in-out font-semibold rounded-lg text-md  text-emerald-600 dark:text-emerald-800 hover:bg-white"
                        on={1}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="w-6 h-6 inline"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                          />
                        </svg>
                      </button>
                    </Tooltip>
                  </div>

                  <div className="float-right absolute right-4 top-4 ">
                    <button type="button" onClick={closeModal}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="35"
                        height="35"
                        fill="currentColor"
                        viewBox="0 0 512 512"
                      >
                        {" "}
                        <title>ionicons-v5-m</title>{" "}
                        <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                      </svg>
                    </button>
                  </div>
                  <div className="text-2xl pt-7 font-normal">
                    <div className="pr-3 inline">{originLocation.name}</div>
                    <RightArrowIcon className="inline"></RightArrowIcon>
                    <select
                      className="form-control"
                      onChange={onChangeDestinationDropdown}
                    >
                      <option key="default" value="default" defaultValue>
                        -- All destinations --
                      </option>
                      {destinations.map(function (dest) {
                        return (
                          <option key={dest._id} value={dest._id}>
                            {dest.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </Dialog.Title>

                {/* Table contents */}
                <div className="w-full bg-emerald-400 rounded-3xl p-4 flex flex-col mt-2">
                  <div className="w-full grow flex flex-col items-center p-3">
                    <div className="w-full flex flex-col justify-center">
                      <div className="flex gap-3">
                        {/* First column: Times */}
                        <div className="flex flex-col gap-2 items-center">
                          <div className="invisible bg-emerald-900 font-semibold text-lg text-white rounded-2xl px-3 py-7 h-28 flex flex-col gap-2 justify-between items-center">
                            <span>Placeholder</span>
                          </div>
                          <button
                            type="button"
                            id="Overall"
                            onClick={handleActiveScoreTime}
                            className={`bg-emerald-900 hover:bg-emerald-600 font-semibold text-lg text-white rounded-2xl px-7 py-2 h-14 flex flex-col gap-2 justify-between items-center ${
                              activeScoreTime === "Overall"
                                ? "bg-emerald-600"
                                : ""
                            }`}
                          >
                            <span>Overall</span>
                          </button>
                          <button
                            type="button"
                            id="Rush-Hour"
                            onClick={handleActiveScoreTime}
                            className={`bg-emerald-900 hover:bg-emerald-600 font-semibold text-lg text-white rounded-2xl px-7 py-2 h-14 flex flex-col gap-2 justify-between items-center ${
                              activeScoreTime === "Rush-Hour"
                                ? "bg-emerald-600"
                                : ""
                            }`}
                          >
                            <span>Rush-Hour</span>
                          </button>
                          <button
                            type="button"
                            id="Off-Peak"
                            onClick={handleActiveScoreTime}
                            className={`bg-emerald-900 hover:bg-emerald-600 font-semibold text-lg text-white rounded-2xl px-7 py-2 h-14 flex flex-col gap-2 justify-between items-center ${
                              activeScoreTime === "Off-Peak"
                                ? "bg-emerald-600"
                                : ""
                            }`}
                          >
                            <span>Off-Peak</span>
                          </button>
                          <button
                            type="button"
                            id="Weekend"
                            onClick={handleActiveScoreTime}
                            className={`bg-emerald-900 hover:bg-emerald-600 font-semibold text-lg text-white rounded-2xl px-7 py-2 h-14 flex flex-col gap-2 justify-between items-center ${
                              activeScoreTime === "Weekend"
                                ? "bg-emerald-600"
                                : ""
                            }`}
                          >
                            <span>Weekend</span>
                          </button>
                          <button
                            type="button"
                            id="Overnight"
                            onClick={handleActiveScoreTime}
                            className={`bg-emerald-900 hover:bg-emerald-600 font-semibold text-lg text-white rounded-2xl px-7 py-2 h-14 flex flex-col gap-2 justify-between items-center ${
                              activeScoreTime === "Overnight"
                                ? "bg-emerald-600"
                                : ""
                            }`}
                          >
                            <span>Overnight</span>
                          </button>
                        </div>
                        {/* Second column: Score */}
                        <div className="flex flex-col gap-2 items-center">
                          <CircleWithText
                            className="pl-3 invisible h-28"
                            size="w-14 h-14"
                            textClass="text-lg font-bold"
                            bgColor="bg-white dark:bg-teal-900"
                            gradient="bg-gradient-to-br from-green-300 to-green-500 dark:from-white dark:to-green-400"
                          >
                            {savedScores.rushHour}
                          </CircleWithText>
                          <CircleWithText
                            className="pl-3"
                            size="w-14 h-14"
                            textClass="text-lg font-bold"
                            borderColor={savedScores.overallColor}
                            textColor={savedScores.overallColor}
                          >
                            {savedScores.overall}
                          </CircleWithText>
                          <CircleWithText
                            className="pl-3"
                            size="w-14 h-14"
                            textClass="text-lg font-bold"
                            borderColor={savedScores.rushHourColor}
                            textColor={savedScores.rushHourColor}
                          >
                            {savedScores.rushHour}
                          </CircleWithText>
                          <CircleWithText
                            className="pl-3"
                            size="w-14 h-14"
                            textClass="text-lg font-bold"
                            borderColor={savedScores.offPeakColor}
                            textColor={savedScores.offPeakColor}
                          >
                            {savedScores.offPeak}
                          </CircleWithText>
                          <CircleWithText
                            className="pl-3"
                            size="w-14 h-14"
                            textClass="text-lg font-bold"
                            borderColor={savedScores.weekendColor}
                            textColor={savedScores.weekendColor}
                          >
                            {savedScores.weekend}
                          </CircleWithText>
                          <CircleWithText
                            className="pl-3"
                            size="w-14 h-14"
                            textClass="text-lg font-bold"
                            borderColor={savedScores.overnightColor}
                            textColor={savedScores.overnightColor}
                          >
                            {savedScores.overnight}
                          </CircleWithText>
                        </div>
                        {/* Third column: Table and caroussel */}
                        <div className="flex flex-col gap-2 items-center">
                          {/* Score statistics */}
                          <table className="border-separate border-spacing-3">
                            <thead>
                              <tr>
                                <th>
                                  <div className="bg-emerald-900 font-semibold text-lg text-white rounded-2xl px-4 py-2 items-center">
                                    <table className="text-center border-separate border-spacing-1">
                                      <tbody>
                                        <tr>
                                          <td colSpan={3} className="border-b">
                                            Frequency
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="border-r px-2">Min</td>
                                          <td className="border-r px-2">Avg</td>
                                          <td className="px-2">Max</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </th>
                                <th>
                                  <div className="bg-emerald-900 font-semibold text-lg text-white rounded-2xl px-4 py-2 items-center">
                                    <table className="text-center border-separate border-spacing-1">
                                      <tbody>
                                        <tr>
                                          <td colSpan={3} className="border-b">
                                            Duration
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="border-r px-2">Min</td>
                                          <td className="border-r px-2">Avg</td>
                                          <td className="px-2">Max</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </th>
                                <th>
                                  <div className="bg-emerald-900 font-semibold text-lg text-white rounded-2xl px-4 py-2 items-center">
                                    <table className="text-center border-separate border-spacing-1">
                                      <tbody>
                                        <tr>
                                          <td colSpan={3} className="border-b">
                                            Walk
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="border-r px-2">Min</td>
                                          <td className="border-r px-2">Avg</td>
                                          <td className="px-2">Max</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>
                                  <div className="bg-white font-semibold text-lg text-emerald-500 rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                                    <table className="text-center table-fixed border-separate border-spacing-1">
                                      <tbody>
                                        <tr>
                                          <td className="border-r border-emerald-900/30 px-3 w-12">
                                            20
                                          </td>
                                          <td className="border-r border-emerald-900/30 px-3 w-12">
                                            25
                                          </td>
                                          <td className="px-3 w-12">30</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </td>
                                <td>
                                  <div className="bg-white font-semibold text-lg text-emerald-500 rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                                    <table className="text-center table-fixed border-separate border-spacing-1">
                                      <tbody>
                                        <tr>
                                          <td className="border-r border-emerald-900/30 px-3 w-12">
                                            20
                                          </td>
                                          <td className="border-r border-emerald-900/30 px-3 w-12">
                                            25
                                          </td>
                                          <td className="px-3 w-12">30</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </td>
                                <td>
                                  <div className="bg-white font-semibold text-lg text-emerald-500 rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                                    <table className="text-center table-fixed border-separate border-spacing-1">
                                      <tbody>
                                        <tr>
                                          <td className="border-r border-emerald-900/30 px-3 w-12">
                                            20
                                          </td>
                                          <td className="border-r border-emerald-900/30 px-3 w-12">
                                            25
                                          </td>
                                          <td className="px-3 w-12">30</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          {/* Caroussel */}
                          <Carousel
                            autoPlay={false}
                            animation="slide"
                            cycleNavigation={false}
                            navButtonsAlwaysVisible={true}
                            indicators={false}
                            className="grow rounded-3xl bg-emerald-50 flex flex-col  px-7 py-2 h-14 w-full "
                            sx={{
                              button: {
                                "&:hover": {
                                  opacity: "1 !important",
                                },
                              },
                              buttonWrapper: {
                                "&:hover": {
                                  "& $button": {
                                    backgroundColor: "black",
                                    filter: "brightness(120%)",
                                    opacity: "1",
                                  },
                                },
                              },
                            }}
                          >
                            <div className="flex flex-col  px-7 py-2 h-14 w-full ">
                              <span>Route 1</span>
                              <span>Route 2</span>
                              <span>Route 3</span>
                              <span>Route 4</span>
                            </div>

                            <div className="grow rounded-3xl bg-emerald-50 flex flex-col  px-7 py-2 h-14 w-full ">
                              <span>Car</span>
                              <span>Personal Bike</span>
                              <span>Bixi</span>
                              <span>Walk</span>
                            </div>
                          </Carousel>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default ScoreDetailModal;
