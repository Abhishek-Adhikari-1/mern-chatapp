// @refresh reset
import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const socketContext = createContext();

export const useSocketContext = () => {
	return useContext(socketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { authUser } = useAuthContext();

	useEffect(() => {
		if (authUser) {
			const socketConn = io("http://localhost:8000", {
				query: {
					userId: authUser._id,
				},
			});
			setSocket(socketConn);

			if (socketConn) {
				socketConn.on("getOnlineUsers", (users) => {
					if (users !== null || users !== undefined)
						setOnlineUsers(users);
				});
			}
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [authUser]);

	return (
		<socketContext.Provider value={{ socket, onlineUsers }}>
			{children}
		</socketContext.Provider>
	);
};
