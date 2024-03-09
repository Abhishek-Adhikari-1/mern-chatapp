import toast from "react-hot-toast";
import { useState } from "react";

const useForgot = () => {
	const [loading, setLoading] = useState(false);

	const forgot = async ({ email }) => {
		const success = handleInputErrors({
			email,
		});
		if (!success) return;
		try {
			setLoading(true);
			const response = await fetch("/api/auth/forgot", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
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

	return { forgot, loading };
};

function handleInputErrors({ email }) {
	let errors = [];
	if (!email.trim()) {
		errors.push("Please fill all the fields.");
	}
	if (!email.trim().includes("@") || !email.trim().includes(".")) {
		errors.push("Please enter a valid email address.");
	}
	return true;
}

export default useForgot;
