import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useConversation from "../zustand/useConversation";

const useGetMessages = () => {
	const [loading, setLoading] = useState(true);

	const { messages, setMessages, selectedConversation } =
		useConversation();

	useEffect(() => {
		const getMessages = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					`/api/messages/${selectedConversation._id}`
				);

				const data = await response.json();

				if (data.error) {
					throw new Error(data.error);
				}
				setMessages(data);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};
		if (selectedConversation?._id) getMessages();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedConversation?._id]);

	return { loading, messages, selectedConversation };
};

export default useGetMessages;
