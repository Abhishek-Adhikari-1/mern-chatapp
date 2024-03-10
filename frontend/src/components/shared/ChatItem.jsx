import { Avatar, Box, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import CircleIcon from "@mui/icons-material/Circle";
import useConversation from "./../../zustand/useConversation";
import { useEffect } from "react";
import { useSocketContext } from "../../context/socketContext";

const ChatItem = ({
	user,
	lastMessage,
	isActive,
	chatid,
	chatUser,
}) => {
	const {
		setChatListLoading,
		setSelectedConversation,
		selectedConversation,
	} = useConversation();

	const { onlineUsers } = useSocketContext();

	const isOnline = onlineUsers?.includes(user?._id) || false;

	useEffect(() => {
		if (chatid === user._id) {
			setSelectedConversation(user);
			setChatListLoading(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (selectedConversation?._id !== chatid && chatUser !== false) {
			setSelectedConversation(chatUser);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chatid]);

	const handleZutsu = () => {
		setSelectedConversation(user);
		setChatListLoading(false);
	};

	return (
		<Link
			to={`/chat/${user._id}`}
			id={user._id}
			onClick={handleZutsu}
			style={{
				margin: "5px 0",
				backgroundColor: isActive
					? "rgba(0, 0, 0, 0.25)"
					: "rgba(251, 251, 251, 0.25)",
				boxSizing: "border-box",
				backdropFilter: "blur(5px)",
				borderRadius: "5px",
				padding: "1rem",
				textDecoration: "none",
				color: isActive ? "rgb(211 220 235)" : "rgb(46, 51, 63)",
			}}>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					width: "100%",
					position: "relative",
				}}>
				<Avatar src={user.profilePic} />
				<Stack
					margin={"0 0 0 10px"}
					sx={{
						flexGrow: 1,
						overflow: "hidden",
						display: "block",
					}}>
					<Typography
						fontWeight="bold"
						sx={{
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "ellipsis",
						}}>
						{user.fullName}
					</Typography>
					<Typography
						sx={{
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "ellipsis",
						}}>
						{lastMessage}
					</Typography>
				</Stack>
				<CircleIcon
					sx={{
						width: "12px",
						color: isOnline ? "##419c45" : "##949494",
					}}
				/>
			</Box>
		</Link>
	);
};

export default ChatItem;
