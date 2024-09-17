import Modal from "react-modal";
import PropTypes from "prop-types";
import { IoClose } from "react-icons/io5";
import { FaUserDoctor } from 'react-icons/fa6';
import { useState } from 'react';
import { customStyles, miniCustomStyles } from "../../constants";
import { ReactSearchAutocomplete } from 'react-search-autocomplete';

export const MenuDoctorsModal = ({
    doctorsModalIsOpen,
    doctorsModaSetIsOpen,
}) => {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const fetchDoctors = () => {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };
        fetch("http://localhost:3000/doctors", requestOptions)
            .then((response) => response.json())
            .then((result) => setDoctors(result))
            .catch((error) => console.error(error));
    };

    const handleDoctorSelect = (doctor) => {
        setSelectedDoctorId(doctor.id);
        setSelectedDoctor(doctor);
    };

    const handleOnSearch = (string, results) => {
        if (string === "") {
            fetchDoctors();
        } else {
            const filteredDoctors = doctors.filter(doctor =>
                doctor.firstName.toLowerCase().includes(string.toLowerCase()) ||
                doctor.lastName.toLowerCase().includes(string.toLowerCase()) || 
                doctor.specialities.toLowerCase().includes(string.toLowerCase())
            );
            setDoctors(filteredDoctors);
        }
    };

    const handleOnSelect = (item) => {
        handleDoctorSelect(item);
    };

    const formatResult = (item) => {
        return (
            <div className='relative min-h-max z-50'>
                <div className='flex flex-col p-2 m-1'>
                    <div className='flex items-center justify-between'>
                        <span className='font-ubuntu font-bold text-carbon text-sm'>{item.firstName} {item.lastName}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <button>
                <FaUserDoctor
                    onClick={() => {
                        doctorsModaSetIsOpen(true);
                        fetchDoctors();
                    }}
                    size={25}
                    color="#ffffff"
                />
            </button>
            <Modal
                isOpen={doctorsModalIsOpen}
                onRequestClose={() => doctorsModaSetIsOpen(false)}
                style={customStyles}
            >
                <button
                    className="text-2xl"
                    onClick={() => doctorsModaSetIsOpen(false)}
                >
                    <IoClose />
                </button>
                <section className="flex flex-col items-center justify-center gap-2 text-xl w-full">
                    <h2 className="text-3xl p-6 text-center">Doctores</h2>
                    <div className='relative z-50 w-full'>
                        <ReactSearchAutocomplete
                            items={doctors}
                            onSearch={handleOnSearch}
                            onSelect={handleOnSelect}
                            autoFocus
                            formatResult={formatResult}
                            fuseOptions={{ keys: ["firstName", "lastName", "specialities"] }} 
                            resultStringKeyName="firstName" 
                        />
                    </div>
                    {doctors.map((doctor) => (
                        <label key={doctor.id} className={`flex flex-col items-center w-full gap-2 p-4 m-3 rounded-xl border-[0.1rem] border-solid border-cakeBlue text-carbon cursor-pointer ${selectedDoctorId === doctor.id ? 'bg-blue-200' : 'bg-lightCakeBlue'}`}>
                            <input
                                type="radio"
                                name="doctor"
                                value={doctor.id}
                                checked={selectedDoctorId === doctor.id}
                                onChange={() => handleDoctorSelect(doctor)}
                                className="hidden"
                            />
                            <img src={doctor.avatar} alt="doctor" className="w-12 h-12 rounded-full" />
                            <span className="text-2xl">{doctor.firstName} {doctor.lastName}</span>
                            <p className="text-center"> {doctor.specialities}</p>
                        </label>
                    ))}
                </section>
            </Modal>
            {selectedDoctor && (
                <Modal
                    isOpen={!!selectedDoctor}
                    onRequestClose={() => setSelectedDoctor(null)}
                    style={miniCustomStyles}
                >
                    <button
                        className="text-2xl"
                        onClick={() => setSelectedDoctor(null)}
                    >
                        <IoClose />
                    </button>
                    <div className="flex flex-col items-center justify-center gap-2 text-xl w-full">
                        <h2 className="text-3xl p-6 text-center">{selectedDoctor.firstName} {selectedDoctor.lastName}</h2>
                        <p className="text-center">{selectedDoctor.biography}</p>
                        <p className="text-center">Rating: {selectedDoctor.averageRating ? parseFloat(selectedDoctor.averageRating).toFixed(1) : 'N/A'}</p>
                    </div>
                </Modal>
            )}
        </>
    );
};

MenuDoctorsModal.propTypes = {
    doctorsModalIsOpen: PropTypes.bool.isRequired,
    doctorsModaSetIsOpen: PropTypes.func.isRequired,
};