import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const useGetConversation = () => {
	const [loading, setLoading] = useState(true);
	const [conversations, setConversations] = useState([]);
	useEffect(() => {
		const getConversations = async () => {
			setLoading(true);
			try {
				const response = await fetch("/api/users", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});
				const data = await response.json();
				if (data.error) {
					throw new Error(data.error);
				}
				setConversations(data);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};
		getConversations();
	}, []);
	return { conversations, loading };
};

export default useGetConversation;
