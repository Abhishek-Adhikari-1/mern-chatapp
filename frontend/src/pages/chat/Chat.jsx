import {
	Box,
	Button,
	IconButton,
	Menu,
	MenuItem,
	Stack,
	TextareaAutosize,
	Tooltip,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import { useEffect, useRef, useState } from "react";

import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import useConversation from "./../../zustand/useConversation";
import useSendMessage from "../../hooks/useSendMessage";
// import toast from "react-hot-toast";
import MessageComp from "../../components/message/MessageComp";
import { useParams } from "react-router-dom";
import useListenMessages from "../../hooks/useListenMessages";

const Chat = () => {
	const { chatListLoading, messages } = useConversation();
	useListenMessages();

	const { sendMessage } = useSendMessage();
	const { chatid } = useParams();

	const scrollToBottom = () => {
		endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
	};
	const [state, setState] = useState({
		anchorEl: null,
		message: "",
	});

	useEffect(() => {
		setTimeout(scrollToBottom, 300);
	}, []);

	useEffect(() => {
		setTimeout(scrollToBottom, 50);
	}, [messages]);

	useEffect(() => {
		setTimeout(scrollToBottom, 300);
	}, [state.message, chatid, chatListLoading]);

	const endOfMessagesRef = useRef(null);

	const handleOpenUserMenu = (e) => {
		setState({ ...state, anchorEl: e.currentTarget });
	};

	const handleCloseUserMenu = () => {
		setState({ ...state, anchorEl: null });
	};

	const handleMessageSubmit = async (e) => {
		e.preventDefault();
		if (state.message.trim() === "") return;
		await sendMessage(state.message);
		setState({ ...state, message: "" });
		scrollToBottom();
	};

	return (
		<>
			{!chatListLoading && (
				<Box
					sx={{
						height: "calc(100dvh - 65px)",
						display: "flex",
						flexDirection: "column",
					}}>
					<Box
						sx={{
							flexGrow: 1,
							overflowX: "hidden",
							overflowY: "auto",
							margin: "4px 0",
							display: "flex",
							flexDirection: "column",
							padding: "10px 20px",
						}}>
						<MessageComp />
						<div ref={endOfMessagesRef} />
					</Box>
					<form method="post" onSubmit={handleMessageSubmit}>
						<Stack
							direction={"row"}
							spacing={1}
							padding={"0 15px 0 0"}>
							<Box
								sx={{
									display: "flex",
									width: "100%",
									justifyContent: "center",
									alignItems: "center",
								}}>
								<Tooltip title="Send Files">
									<IconButton onClick={handleOpenUserMenu}>
										<AttachFileIcon />
									</IconButton>
								</Tooltip>
								<Menu
									id="menu-file-handler"
									anchorEl={state.anchorEl}
									open={Boolean(state.anchorEl)}
									onClose={handleCloseUserMenu}>
									<MenuItem>
										<ImageIcon />
										{"‎ ‎ "}Images
									</MenuItem>
									<MenuItem>
										<InsertDriveFileIcon />
										{"‎ ‎ "}Files
									</MenuItem>
									<MenuItem>
										<RecordVoiceOverIcon />
										Voice Recognition
									</MenuItem>
								</Menu>
								<TextareaAutosize
									id="message-input"
									placeholder="Type a message..."
									value={state.message}
									minRows={1}
									maxRows={4}
									// onKeyDown={handleKeyPress}
									onChange={(e) => {
										setState({
											...state,
											message: e.target.value,
										});
									}}
								/>
							</Box>
							<Button type="submit" variant="contained">
								<SendIcon sx={{ rotate: "-35deg" }} />
							</Button>
						</Stack>
					</form>
				</Box>
			)}
		</>
	);
};

export default Chat;
