// @refresh reset
import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const socketContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSocketContext = () => {
	return useContext(socketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { authUser } = useAuthContext();

	useEffect(() => {
		if (authUser) {
			const socketConn = io("https://mern-chatapp-abhi.onrender.com", {
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
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authUser]);

	return (
		<socketContext.Provider value={{ socket, onlineUsers }}>
			{children}
		</socketContext.Provider>
	);
};
