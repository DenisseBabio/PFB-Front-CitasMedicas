import PropTypes from "prop-types";
import { useState } from "react";

export const AviableTimes = ({
  selectedHour,
  setSelectedHour,
  selectedDoctor,
  availableTimes,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!Array.isArray(availableTimes) || availableTimes.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center text-2xl font-medium">
          <img
            className="w-32 h-32"
            src="/images/Perfil_healthConnect-Photoroom.png"
            alt=""
          />
          <p>Bienvenido</p>
          <div className="text-center text-lg font-medium p-2 m-4">
            Selecciona una especialidad para poder ver las horas disponibles
          </div>
        </div>
      </>
    );
  }

  const currentSlot = availableTimes[currentIndex];

  if (!currentSlot) {
    setCurrentIndex(0); // Ajusta el índice si está fuera de rango
    return <div>No hay horas disponibles</div>;
  }

  return (
    <div className="my-8 border-solid border-[0.1rem] border-lightBlue bg-smokeWhite rounded-xl shadow-[0px_12px_11px_2px_rgba(0,0,0,0.2)] p-4 max-w-md mx-auto">
      {selectedDoctor && (
        <div className="flex gap-4 items-center justify-start">
          <img
            className="border-solid border-[0.15rem] border-lightBlue rounded-xl w-16 h-16"
            src={currentSlot.avatar}
            alt=""
          />
          <h3 className="text-xl font-medium">{currentSlot.doctorName}</h3>
        </div>
      )}
      <div className="">
        <ul className="grid grid-cols-3 sm:grid-cols-5 mb-4 mt-6 justify-items-center">
          {currentSlot.freeHours.map((hour, idx) => (
            <li
              className={`rounded-xl font-medium p-1.5 m-1 w-max text-carbon ${
                selectedHour === hour
                  ? "bg-lightBlue text-smokeWhite shadow-[inset_0px_0px_9px_5px_rgba(0,0,0,0.2)]"
                  : "bg-light shadow-[0px_0px_5px_1px_rgba(0,0,0,0.2)]"
              }`}
              key={idx}
            >
              <label>
                <input
                  type="radio"
                  name="selectedHour"
                  value={hour}
                  className="hidden"
                  onChange={() => setSelectedHour(hour)}
                />
                {hour}
              </label>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex text-4xl justify-between">
        {!selectedDoctor && (
          <>
            <div className="flex gap-2 items-center justify-center">
              <img
                className="rounded-xl w-14 h-14"
                src="/images/Perfil_healthConnect_blue.png"
                alt=""
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

AviableTimes.propTypes = {
  availableTimes: PropTypes.arrayOf(
    PropTypes.shape({
      doctorName: PropTypes.string.isRequired,
      freeHours: PropTypes.arrayOf(PropTypes.string).isRequired,
      avatar: PropTypes.string,
    })
  ).isRequired,
  selectedHour: PropTypes.string,
  setSelectedHour: PropTypes.func.isRequired,
  selectedDoctor: PropTypes.object,
};
