import { useEffect } from "react";
import { useSocketContext } from "../context/socketContext";
import useConversation from "./../zustand/useConversation";
import notifSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { messages, setMessages } = useConversation();

	useEffect(() => {
		socket?.on("newMessage", (newMessage) => {
			const sound = new Audio(notifSound);
			sound.play();
			setMessages([...messages, newMessage]);
		});
		return () => socket?.off("newMessage");
	}, [socket, setMessages, messages]);
};

export default useListenMessages;
