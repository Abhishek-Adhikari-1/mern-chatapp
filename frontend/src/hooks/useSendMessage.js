import { useState } from "react";
import useConversation from "../zustand/useConversation";
import { toast } from "react-hot-toast";

const useSendMessage = () => {
	const [sendState, setSendState] = useState({
		loading: false,
		message: "",
		chatid: null,
	});

	const { messages, setMessages, selectedConversation } = useConversation();

	const sendMessage = async (text) => {
		setSendState({
			...sendState,
			loading: true,
		});
		try {
			const response = await fetch(
				`/api/messages/send/${selectedConversation?._id}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						message: text,
					}),
				}
			);

			const data = await response.json();

			if (data.error) {
				throw new Error(data.error);
			}
			setMessages([...messages, data]);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setSendState({
				...sendState,
				loading: false,
			});
		}
	};
	return {
		sendState,
		sendMessage,
	};
};

export default useSendMessage;
