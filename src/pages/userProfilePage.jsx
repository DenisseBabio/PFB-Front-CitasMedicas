import { useContext, useEffect, useState } from "react";
import { DinamicTitle } from "../components/SingleTitle";
import { AuthContext } from "./../contexts/authContext";
import { API_HOST } from "../constants";
import { useAuthGuard } from './../hooks/authGuard';

export const UserProfile = () => {
	// Estado para manejar la imagen
	const { currentUser } = useContext(AuthContext);
	const token = currentUser?.coded;
	const userType = currentUser?.decoded.userType;
	const [image, setImage] = useState(currentUser?.decoded.avatar);
	const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState(currentUser?.decoded.userName);
	const [name, setName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [biography, setBiography] = useState("");
	const [experience, setExperience] = useState("");


useAuthGuard("/profile")


	// Función para manejar la subida de la imagen
	const handleImageUpload = (event) => {
		const file = event.target.files[0];
		setImage(URL.createObjectURL(file));
	};

	const updateProfile = () => {
		const myHeaders = new Headers();
		myHeaders.append("Authorization", token);
		myHeaders.append("Content-Type", "application/json");

		const raw = JSON.stringify({
			firstName: name,
			lastName: lastName,
      userName: userName,
			email: email,
			biography: biography,
			experience: experience,
		});

		const requestOptions = {
			method: "PATCH",
			headers: myHeaders,
			body: raw,
			redirect: "follow",
		};

		fetch(`${API_HOST}/profile/${currentUser.decoded.id}`, requestOptions)
			.then((response) => response.text())
			.then((result) => {
				console.log(result);
				setIsEditing(false);
			})
			.catch((error) => console.error(error));
	};

	const fetchProfile = () => {
		const myHeaders = new Headers();
		myHeaders.append("Authorization", token);
		const requestOptions = {
			method: "GET",
			headers: myHeaders,
			redirect: "follow",
		};

		fetch(`${API_HOST}/profile`, requestOptions)
			.then((response) => response.json())
			.then((result) => {
				const profile = result[0];
				setName(profile.firstName);
				setLastName(profile.lastName);
				setEmail(profile.email);
				setBiography(profile.biography);
				setExperience(profile.experience);
			})
			.catch((error) => console.error(error));
	};

	useEffect(() => {
		fetchProfile();
	}, []);

	// Función para eliminar la imagen y volver a la del placeholder
	const handleRemoveImage = () => {
		setImage(null); // Restablecer la imagen a null para mostrar el placeholder
	};

	// Función para cambiar el estado de edición
	const handleEditProfile = () => {
		setIsEditing(!isEditing); // Cambiar entre modo de edición y modo de visualización
	};

	return (
		<div className="max-w-full sm:max-w-[600px] bg-smokeWhite  md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] mx-auto px-4">
			<DinamicTitle text="Mi perfil" />
			<div className="flex flex-col w-full p-6 rounded-t-xl shadow-lg bg-lightCakeBlue ">
				{/* Encabezado con logo */}
				<div className="flex flex-row gap-3  ">
					<div className="flex items-center w-full">
						<div>
							<img
								src="public/images/Perfil_healthConnect-Photoroom.png"
								width="50"
								alt="Logo"
							/>
						</div>

						<h1 className="ml-3 text-3xl font-bold text-white">
							HealthConnect
						</h1>
					</div>
				</div>

				{/* Encabezado y Foto de Perfil */}
				<div className="relative flex flex-col items-center">
					{/* Contenedor de la Imagen */}
					<div className="relative">
						<img
							src={image}
							alt="Profile"
							className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-md"
						/>
						{/* Botón para subir imagen */}
						<label
							htmlFor="upload"
							className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 cursor-pointer"
						>
							<input
								id="upload"
								type="file"
								className="hidden"
								onChange={handleImageUpload}
							/>
							📷
						</label>

						{/* Botón para eliminar la imagen y volver al placeholder */}
						{image && (
							<button
								className="mt-4 absolute bottom-20 left-20 text-white px-3 py-1 rounded-full"
								onClick={handleRemoveImage}
							>
								✖️
							</button>
						)}
					</div>
					<h2 className="mt-4 text-2xl font-semibold text-smokeWhite">
						{name} {lastName}
					</h2>
					<p className="text-sm text-gray-500">
						{userName}
					</p>
				</div>

				{/* Formulario de Edición / Vista de Información */}
				<div className="flex flex-col items-center justify-center w-full p-6 rounded-lg bg-gray-100">
					<form className="w-full max-w-md">
						{/* Nombre */}
						<div className="pb-2">
							<label
								htmlFor="name"
								className="block mb-2 text-base font-medium text-gray-700"
							>
								Nombre:
							</label>
							{!isEditing ? (
								<div className="bg-gray-200 p-2 rounded-lg">{name}</div>
							) : (
								<input
									type="text"
									id="name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="w-full p-2 border border-gray-300 rounded-lg"
								/>
							)}
						</div>

						{/* Apellidos */}
						<div className="pb-2">
							<label
								htmlFor="lastName"
								className="block mb-2 text-base font-medium text-gray-700"
							>
								Apellidos:
							</label>
							{!isEditing ? (
								<div className="bg-gray-200 p-2 rounded-lg">{lastName}</div>
							) : (
								<input
									type="text"
									id="lastName"
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
									className="w-full p-2 border border-gray-300 rounded-lg"
								/>
							)}
						</div>

						{/* Email */}
						<div className="pb-2">
							<label
								htmlFor="email"
								className="block mb-2 text-base font-medium text-gray-700"
							>
								Email:
							</label>
							{!isEditing ? (
								<div className="bg-gray-200 p-2 rounded-lg">{email}</div>
							) : (
								<input
									type="email"
									id="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full p-2 border border-gray-300 rounded-lg"
								/>
							)}
						</div>
						{/* Biografía */}
						{userType === "doctor" && (
							<div className="pb-2">
								<label
									htmlFor="biography"
									className="block mb-2 text-base font-medium text-gray-700"
								>
									Biografía:
								</label>
								{!isEditing ? (
									<div className="bg-gray-200 p-2 rounded-lg">{biography}</div>
								) : (
									<textarea
										id="biography"
										value={biography}
										onChange={(e) => setBiography(e.target.value)}
										className="w-full p-2 border border-gray-300 rounded-lg"
									/>
								)}
							</div>
						)}

						{/* Experiencia */}
						{userType === "doctor" && (
							<div className="pb-2">
								<label
									htmlFor="experience"
									className="block mb-2 text-base font-medium text-gray-700"
								>
									Experiencia:
								</label>
								{!isEditing ? (
									<div className="bg-gray-200 p-2 rounded-lg">{experience}</div>
								) : (
									<input
										type="text"
										id="experience"
										value={experience}
										onChange={(e) => setExperience(e.target.value)}
										className="w-full p-2 border border-gray-300 rounded-lg"
									/>
								)}
							</div>
						)}
					</form>

					{/* Botón para editar o guardar cambios */}
					<button
						onClick={() => {
							handleEditProfile();
							if (isEditing) {
								updateProfile();
							}
						}}
						className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-full"
					>
						{isEditing ? "Guardar Cambios" : "Editar Perfil"}
					</button>
				</div>

				{/* Enlace de cierre de sesión */}
				<div className="text-sm font-light text-gray-500 text-center mt-6">
					<a href="#" className="font-medium text-blue-500 hover:underline">
						Cerrar sesión
					</a>
				</div>
			</div>
		</div>
	);
};
