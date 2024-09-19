import PropTypes from "prop-types";
import { IoMdClose } from "react-icons/io";
import { FaLaptopMedical, FaPlus } from "react-icons/fa6";
import Modal from "react-modal";
import { API_HOST, consultationsFilesModal } from "../../constants";
import { AuthContext } from "../../contexts/authContext";
import { useContext, useState } from "react";
import { FaEdit, FaSave } from "react-icons/fa";
import { MdAddComment } from "react-icons/md";
import { RiFolderAddFill } from "react-icons/ri";
import { notify } from "../../utils/notify";
import { sendRating } from "./fetch/sendRating";
import { FaFileUpload } from "react-icons/fa";
export const StarRating = ({
  rating,
  handleRating,
  consultationDetails,
  currentUser,
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(
    consultationDetails.rating || 0
  );
  const [isDisabled, setIsDisabled] = useState(
    currentUser.decoded.userType === "doctor"
  );
  const displayRating = selectedRating || 0;

  const handleClick = (newRating) => {
    setSelectedRating(newRating);
    handleRating(newRating);
  };

  return (
    <div className="flex items-center ">
      {[...Array(5)].map((_, index) => (
        <button
          key={index}
          className={`text-3xl ${
            hoverRating > index || displayRating > index
              ? "text-yellow-500"
              : "text-lightBlue"
          }`}
          onClick={() => handleClick(index + 1)}
          onMouseEnter={() => setHoverRating(index + 1)}
          onMouseLeave={() => setHoverRating(0)}
          disabled={isDisabled}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export const ResponseButton = ({
  showResponseFiles,
  setShowResponseFiles,
  consultationDetails,
  consultationId,
}) => {
  const { currentUser } = useContext(AuthContext);
  const token = currentUser?.coded;
  const [isEditing, setIsEditing] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [responseContent, setResponseContent] = useState(
    consultationDetails.responseContent || ""
  );
  // Establecer rating
  const [rating, setRating] = useState(0);
  // Fin de establecer rating

  const isDisabled =
    currentUser.decoded.userType === "patient" &&
    !consultationDetails.responseContent &&
    (!consultationDetails.responseFiles ||
      consultationDetails.responseFiles.length === 0);

  const handleRating = async (newRating) => {
    if (!consultationDetails.id) {
      console.error("Error: consultationId no está definido");
      return;
    }

    try {
      await sendRating(consultationId, newRating, token);
      setRating(newRating);
    } catch (error) {
      console.error("Error al enviar la calificación", error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", token);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      content: responseContent,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `${API_HOST}/consultations/${consultationId}/response`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => notify(result.message))
      .catch((error) => console.error(error));

    setIsEditing(false);
  };

  const handleFileUpload = (e, fileType) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <>
      <button
        className={`mb-4 p-2 w-full text-end text-smokeWhite rounded-lg flex flex-col items-center font-medium ${
          isDisabled ? "bg-darkBlue" : "bg-lightBlue"
        }`}
        onClick={() => setShowResponseFiles(!showResponseFiles)}
        disabled={isDisabled}
      >
        {showResponseFiles ? <IoMdClose /> : <FaLaptopMedical size={30} />}{" "}
        Respuesta
      </button>
      <Modal
        isOpen={showResponseFiles}
        onRequestClose={() => setShowResponseFiles(false)}
        contentLabel="Response Files"
        style={consultationsFilesModal}
      >
        <div className="w-full flex flex-col ">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold my-2 text-carbon p-2">
              RESPUESTA:
            </h2>

            {currentUser.decoded.userType === "doctor" && (
              <div className="">
                {isEditing ? (
                  <button
                    className="bg-green-500 p-2 rounded-lg text-smokeWhite ml-2"
                    onClick={handleSaveClick}
                  >
                    <FaSave size={25} />
                  </button>
                ) : consultationDetails.responseContent ? (
                  <button
                    className="bg-warning p-2 rounded-lg text-smokeWhite"
                    onClick={handleEditClick}
                  >
                    <FaEdit size={25} />
                  </button>
                ) : (
                  <button
                    className="bg-lightBlue p-2 rounded-lg text-smokeWhite"
                    onClick={handleEditClick}
                  >
                    <MdAddComment size={25} />
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="w-full">
            {isEditing ? (
              <textarea
                className="mb-2 w-full h-max font-ubuntu font-bold text-md p-2 min-h-40 break-words rounded-xl"
                value={responseContent}
                onChange={(e) => {
                  setResponseContent(e.target.value);
                }}
              />
            ) : responseContent ? (
              <p className="mb-2 w-full h-max font-ubuntu font-bold text-md p-2 min-h-40 break-words">
                {responseContent}
              </p>
            ) : (
              <p className="mb-2 w-full h-max font-ubuntu font-bold text-md p-2 min-h-40 break-words">
                No hay respuesta
              </p>
            )}
            <div className="flex items-center justify-end pt-2 pb-4">
              <StarRating
                rating={rating}
                handleRating={handleRating}
                consultationDetails={consultationDetails}
                currentUser={currentUser}
              />
            </div>
          </div>
          <div className="bg-smokeWhite p-4 rounded-lg shadow-md w-full">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl text-lightBlue font-semibold mb-2 ">
                Archivos:
              </h3>
              {currentUser.decoded.userType === "doctor" && (
                <>
                  <button
                    className="bg-lightBlue p-2 rounded-lg text-smokeWhite"
                    onClick={() => setShowUploadModal(true)}
                  >
                    <RiFolderAddFill size={25} />
                  </button>
                  <Modal
                    isOpen={showUploadModal}
                    onRequestClose={() => setShowUploadModal(false)}
                    contentLabel="Upload Files"
                    style={consultationsFilesModal}
                  >
                    <div className="w-full flex flex-col">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold font-roboto my-2 text-lightBlue p-2">
                          Subir Archivos
                        </h2>
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer m-2 rounded-full text-lightBlue shadow-xl active:scale-95 transition-transform transform bg-smokeWhite p-2"
                        >
                          <FaPlus size={25} />
                        </label>
                        <input
                          id="file-upload"
                          type="file"
                          multiple
                          onChange={(e) => handleFileUpload(e, "responseFiles")}
                          className="hidden"
                        />
                      </div>
                      <div className="w-full mt-4">
                        <div className="bg-smokeWhite p-4 rounded-xl shadow-xl ">
                          <h3 className="text-2xl text-carbon font-semibold mb-2">
                            Imágenes
                          </h3>
                          <div className="w-full border-t-[0.1rem] border-solid border-lightBlue my-2 "></div>
                          <div className="grid grid-cols-3 auto-rows-auto w-full justify-items-center h-max ">
                            {selectedFiles.filter((file) =>
                              file.name.match(/\.(jpeg|jpg|webp|png)$/)
                            ).length > 0 ? (
                              selectedFiles
                                .filter((file) =>
                                  file.name.match(/\.(jpeg|jpg|webp|png)$/)
                                )
                                .map((file, index) => (
                                  <div key={index} className="w-full relative">
                                    <img
                                      className="w-20 mx-auto h-20 rounded-md border-solid border-lightBlue border-[0.1rem]"
                                      src={URL.createObjectURL(file)}
                                      alt={file.name}
                                    />
                                    <button
                                      className="absolute top-0 right-3 bg-red-500 text-smokeWhite rounded-full p-1"
                                      onClick={() => handleRemoveFile(index)}
                                    >
                                      <IoMdClose size={15} />
                                    </button>
                                  </div>
                                ))
                            ) : (
                              <p className="font-inter font-medium text-md text-carbon text-center w-full col-span-3 py-2">
                                No hay imágenes
                              </p>
                            )}
                          </div>
                          <div className="w-full border-t-[0.1rem] border-solid border-lightBlue my-2 "></div>
                          <h3 className="text-2xl text-carbon font-semibold mb-2 mt-4">
                            Documentos
                          </h3>
                          <div className="w-full border-t-[0.1rem] border-solid border-lightBlue my-2 "></div>
                          <div className="w-full">
                            {selectedFiles.filter(
                              (file) =>
                                !file.name.match(/\.(jpeg|jpg|webp|png)$/)
                            ).length > 0 ? (
                              selectedFiles
                                .filter(
                                  (file) =>
                                    !file.name.match(/\.(jpeg|jpg|webp|png)$/)
                                )
                                .map((file, index) => (
                                  <div
                                    key={index}
                                    className="bg-lightBlue border-[0.1rem] border-solid border-lightBlue w-full p-2 rounded-lg mb-2 relative"
                                  >
                                    <p className="font-inter font-medium text-md text-smokeWhite">
                                      {file.name}
                                    </p>
                                    <button
                                      className="absolute top-2 right-1 bg-red-500 text-smokeWhite rounded-full p-1"
                                      onClick={() => handleRemoveFile(index)}
                                    >
                                      <IoMdClose size={15} />
                                    </button>
                                  </div>
                                ))
                            ) : (
                              <p className="font-inter font-medium text-md text-carbon text-center w-full col-span-3 py-2">
                                No hay documentos
                              </p>
                            )}
                          </div>
                          <div className="w-full border-t-[0.1rem] border-solid border-lightBlue my-2 "></div>
                          <div className="flex items-center justify-end mr-">
                            <button
                              className="bg-smokeWhite flex items-center gap-2 text-md font-bold font-inter p-2 rounded-b-lg w-max text-lightBlue active:scale-95 transition-transform transform"
                              onClick={() => {
                                const myHeaders = new Headers();
                                myHeaders.append("Authorization", token);
                                const formData = new FormData();
                                selectedFiles.forEach((file) => {
                                  formData.append("files", file);
                                });
                                const requestOptions = {
                                  method: "POST",
                                  headers: myHeaders,
                                  body: formData,
                                  redirect: "follow",
                                };
                                fetch(
                                  `${API_HOST}/consultations/${consultationId}/response/files`,
                                  requestOptions
                                )
                                  .then((response) => response.text())
                                  .then((result) => console.log(result))
                                  .catch((error) => console.error(error));
                              }}
                            >
                              <FaFileUpload size={30} /> Subir Archivos
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center w-full mt-4">
                        <button
                          className="bg-smokeWhite p-2 rounded-full text-lightBlue shadow-xl active:scale-95 transition-transform transform"
                          onClick={() => setShowUploadModal(false)}
                        >
                          <IoMdClose size={30} />
                        </button>
                      </div>
                    </div>
                  </Modal>
                </>
              )}
            </div>
            <div className="w-full border-t-[0.1rem] border-solid border-lightBlue my-2 "></div>
            <div className="grid grid-cols-3 auto-rows-auto w-full justify-items-center h-max ">
              {consultationDetails.responseFiles &&
              consultationDetails.responseFiles.filter(
                (file) =>
                  file.filePath.match(/\.(jpeg|jpg|webp|png)$/) ||
                  file.filePath.includes("i.pravatar.cc")
              ).length > 0 ? (
                consultationDetails.responseFiles
                  .filter(
                    (file) =>
                      file.filePath.match(/\.(jpeg|jpg|webp|png)$/) ||
                      file.filePath.includes("i.pravatar.cc")
                  )
                  .map((file, index) => (
                    <div key={index} className="w-full">
                      <img
                        className="w-20 mx-auto h-auto rounded-md border-solid border-lightBlue border-[0.1rem]"
                        src={`${API_HOST}/responseFiles/${file.filePath.replace(
                          /^.*[\\/]/,
                          ""
                        )}`}
                        alt={file.fileName}
                      />
                    </div>
                  ))
              ) : (
                <p className="font-inter font-medium text-md text-carbon text-center w-full col-span-3 py-2">
                  No hay imágenes
                </p>
              )}
            </div>
            <div className="w-full border-t-[0.1rem] border-solid border-lightBlue my-2 "></div>
            <div className="w-full">
              {consultationDetails.responseFiles &&
              consultationDetails.responseFiles.filter(
                (file) => !file.filePath.match(/\.(jpeg|jpg|webp|png)$/)
              ).length > 0 ? (
                consultationDetails.responseFiles
                  .filter(
                    (file) => !file.filePath.match(/\.(jpeg|jpg|webp|png)$/)
                  )
                  .map((file, index) => (
                    <div
                      key={index}
                      className="bg-lightBlue border-[0.1rem] border-solid border-lightBlue w-full p-2 rounded-lg mb-2"
                    >
                      <p className="font-inter font-medium text-md text-smokeWhite">
                        {file.fileName}
                      </p>
                    </div>
                  ))
              ) : (
                <p className="font-inter font-medium text-md text-carbon text-center py-2">
                  No hay documentos
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-full mt-4 ">
          <button
            className="bg-smokeWhite p-2 rounded-full text-lightBlue  shadow-xl active:scale-95 transition-transform transform"
            onClick={() => setShowResponseFiles(false)}
          >
            <IoMdClose size={30} />
          </button>
        </div>
      </Modal>
    </>
  );
};

ResponseButton.propTypes = {
  showResponseFiles: PropTypes.bool.isRequired,
  setShowResponseFiles: PropTypes.func.isRequired,
  consultationDetails: PropTypes.shape({
    id: PropTypes.number.isRequired,
    responseContent: PropTypes.string,
    responseFiles: PropTypes.arrayOf(
      PropTypes.shape({
        filePath: PropTypes.string,
        fileName: PropTypes.string,
      })
    ),
  }).isRequired,
  consultationId: PropTypes.number.isRequired,
  rating: PropTypes.number,
  onRate: PropTypes.func,
};
