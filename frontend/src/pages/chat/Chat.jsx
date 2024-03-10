import "regenerator-runtime/runtime";
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
import SpeechRecognition, {
	useSpeechRecognition,
} from "react-speech-recognition";

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
import toast from "react-hot-toast";

const Chat = () => {
	const { chatListLoading, messages } = useConversation();
	const [state, setState] = useState({
		anchorEl: null,
		message: "",
	});
	useListenMessages();

	const commands = [
		{
			command: "reset",
			callback: () => resetTranscript(),
		},
		{
			command: "shut up",
			callback: () => alert("I wasn't talking."),
		},
		{
			command: "Hello abhi",
			callback: () => alert("Hello! k xa."),
		},
	];
	const { transcript, resetTranscript, listening } = useSpeechRecognition({
		commands,
	});

	if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
		alert(
			"Your browser does not support speech recognition software! Try Chrome desktop, maybe?"
		);
	}

	const listenContinuously = () => {
		SpeechRecognition.startListening({
			continuous: true,
			language: "en-IN",
		});
	};

	useEffect(() => {
		if (transcript !== "") {
			setState({
				...state,
				message: transcript,
			});
			return;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [transcript]);

	useEffect(() => {
		if (listening) {
			listenContinuously();
			toast(
				() => (
					<span>
						<Box component={"span"}>
							<b
								style={{
									display: "flex",
								}}>
								Listening
								<div id="bars"></div>
							</b>
						</Box>
						<p>Speak a loud for better recognition</p>
						<Box
							component={"span"}
							sx={{
								display: "flex",
								justifyContent: "space-evenly",
								marginTop: "10px",
							}}>
							<Button
								size={"small"}
								color={"error"}
								onClick={() => {
									SpeechRecognition.stopListening();
									setState({
										...state,
										message: "",
									});
									resetTranscript();
								}}>
								Cancel
							</Button>
							<Button
								size={"small"}
								variant="outlined"
								onClick={() => {
									SpeechRecognition.stopListening();
								}}>
								Stop
							</Button>
						</Box>
					</span>
				),
				{
					duration: Infinity,
				}
			);
		} else {
			SpeechRecognition.stopListening();
			toast.dismiss();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [listening]);

	const { sendMessage } = useSendMessage();
	const { chatid } = useParams();

	const scrollToBottom = () => {
		endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
	};

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

	const handleKeyPress = (e) => {
		if (
			e.key === "Enter" &&
			!e.shiftKey &&
			!("ontouchstart" in window || navigator.maxTouchPoints)
		) {
			e.preventDefault();
			handleMessageSubmit();
		}
	};

	const handleMessageSubmit = async () => {
		if (state.message.trim() === "") return;
		await sendMessage(state.message);
		setState({ ...state, message: "" });
		scrollToBottom();
		SpeechRecognition.stopListening();
		resetTranscript();
	};

	const checkMicrophonePermission = async () => {
		try {
			const permissionStatus = await navigator.permissions.query({
				name: "microphone",
			});
			if (permissionStatus.state === "granted") {
				listenContinuously();
			} else if (permissionStatus.state === "prompt") {
				await navigator.mediaDevices.getUserMedia({ audio: true });
				listenContinuously();
			} else {
				alert(
					"Microphone access is denied. Please enable it in your browser settings."
				);
			}
		} catch (error) {
			console.error("Error checking microphone permission:", error);
		}
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
									<MenuItem
										onClick={() => {
											handleCloseUserMenu();
											checkMicrophonePermission();
										}}>
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
									onKeyDown={handleKeyPress}
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
