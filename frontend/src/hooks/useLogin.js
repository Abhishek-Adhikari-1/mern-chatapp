import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { useState } from "react";

const useLogin = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const login = async ({ email, password }) => {
		const success = handleInputErrors({
			email,
			password,
		});
		if (!success) return;
		try {
			setLoading(true);
			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					password,
				}),
			});
			const data = await response.json();

			if (data.error) {
				throw new Error(data.error);
			}

			localStorage.setItem("authUser", JSON.stringify(data));
			toast.success(data.message);

			setAuthUser(data);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { login, loading };
};

function handleInputErrors({ email, password }) {
	let errors = [];
	if (!email.trim() || !password) {
		errors.push("Please fill all the fields.");
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

export default useLogin;
