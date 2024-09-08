import PropTypes from "prop-types";
import { FiEdit } from "react-icons/fi";
import { MdSaveAs } from "react-icons/md";
import { handleEditConsultation } from "./fetch/editConsultationFetch";
import { useNavigate } from "react-router-dom";

export const DescriptionSection = ({
	userType,
	setIsEditing,
	isEditing,
	id,
	consultationDetails,
	setConsultationDetails,
}) => {
	const navigate = useNavigate();
	return (
		<>
			<div className="w-full h-max">
				<div className="flex justify-between items-center mb-2 h-max">
					<h3 className="text-lg font-semibold text-lightBlue">Descripción:</h3>
					{userType === "patient" && (
						<button
							className="p-2 text-lightBlue rounded"
							onClick={() =>
								setIsEditing({
									...isEditing,
									description: !isEditing.description,
								})
							}
						>
							{isEditing.description ? (
								<MdSaveAs
								size={20}
									onClick={() =>
										handleEditConsultation(
											id,
											consultationDetails,
											setConsultationDetails,
											setIsEditing,
											navigate
										)
									}
								/>
							) : (
								<FiEdit size={20} />
							)}
						</button>
					)}
				</div>
				<textarea
					name="description"
					className=" w-full h-[10rem] p-2 font-medium break-words"
					value={consultationDetails.description}
					onChange={(e) =>
						setConsultationDetails({
							...consultationDetails,
							description: e.target.value,
						})
					}
					disabled={!isEditing.description}
				/>
			</div>
		</>
	);
};

DescriptionSection.propTypes = {
	userType: PropTypes.string.isRequired,
	isEditing: PropTypes.object.isRequired,
	setIsEditing: PropTypes.func.isRequired,
	id: PropTypes.string.isRequired,
	consultationDetails: PropTypes.shape({
		title: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
	}).isRequired,
	setConsultationDetails: PropTypes.func.isRequired,
};
