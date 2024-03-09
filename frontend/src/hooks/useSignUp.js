import { useState } from "react";
import toast from "react-hot-toast";

const useSignUp = () => {
	const [loading, setLoading] = useState(false);

	const signup = async ({
		fullName,
		email,
		password,
		confirmPassword,
		gender,
	}) => {
		const success = handleInputErrors({
			fullName,
			email,
			password,
			confirmPassword,
			gender,
		});
		if (!success) return;
		try {
			setLoading(true);
			const response = await fetch("/api/auth/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					fullName,
					email,
					password,
					confirmPassword,
					gender,
				}),
			});
			const data = await response.json();
			if (data.error) {
				throw new Error(data.error);
			}
			toast.success(data.message);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return {
		signup,
		loading,
	};
};

function handleInputErrors({
	fullName,
	email,
	password,
	confirmPassword,
	gender,
}) {
	let errors = [];
	if (
		!fullName.trim() ||
		!email.trim() ||
		!password.trim() ||
		!confirmPassword.trim() ||
		!gender
	) {
		errors.push("Please fill all the fields.");
	}
	if (password !== confirmPassword) {
		errors.push("Passwords do not match.");
	}
	if (password.length < 6) {
		errors.push("Password must be at least 6 characters long.");
	}
	if (!email.trim().includes("@") || !email.trim().includes(".")) {
		errors.push("Please enter a valid email address.");
	}
	if (errors.length > 0) {
		errors.forEach((error) => toast.error(error));
		return false;
	}
	return true;
}

export default useSignUp;
