// import {  useState } from "react";
import useGetMessages from "./../../hooks/useGetMessages";
import { Avatar, Box, Stack } from "@mui/material";
import { signal } from "@preact/signals";
import { extractTime } from "../../utils/extractTime";

const MessageComp = () => {
	const { messages, selectedConversation } = useGetMessages();

	const prevMessage = signal(false);
	return (
		<>
			{messages.map((item, index) => {
				const isSentByCurrentUser =
					item.senderId !== selectedConversation?._id;
				const isFirstMessage = index === 0 || !prevMessage.value;
				const isSameSender =
					prevMessage.value &&
					prevMessage.value.senderId === item.senderId;
				const isSameReceiver =
					prevMessage.value &&
					prevMessage.value.receiverId === item.receiverId;
				const shouldRenderAvatar =
					isFirstMessage || !(isSameSender && isSameReceiver);
				const formattedDate = extractTime(item.createdAt);

				prevMessage.value = item;

				return (
					<Stack
						key={item._id}
						id={`${item._id}-823w2erygh`}
						position={"relative"}>
						{shouldRenderAvatar && !isSentByCurrentUser && (
							<Avatar
								src={selectedConversation?.profilePic}
								sx={{
									position: "absolute",
									top: "0px",
									left: "-10px",
									maxWidth: "33px",
									maxHeight: "33px",
								}}
							/>
						)}
						<Stack
							id={`78uy8923wi-${item._id}`}
							sx={{
								mb: 1,
								ml: isSentByCurrentUser ? "0" : "30px",
								maxWidth: {
									xs: "85%",
									sm: "80%",
									lg: "70%",
								},
								backgroundColor: isSentByCurrentUser
									? "rgba(5, 5, 5, 0.35)"
									: "rgba(251, 251, 251, 0.35)",
								backdropFilter: "blur(4px) !important",
								p: "5px 10px",

								borderRadius: "10px",
								border: isSentByCurrentUser
									? "1px solid rgba(5, 5, 5, 0.15)"
									: "1px solid rgba(255, 255, 255, 0.25)",
								overflowWrap: "anywhere",
								color: isSentByCurrentUser
									? "rgb(232, 222, 222)"
									: "rgb(46, 51, 63)",
								alignSelf: isSentByCurrentUser
									? "flex-end"
									: "flex-start",
								fontSize: {
									xs: "13px",
									sm: "15px",
									lg: "17px",
								},
							}}>
							{shouldRenderAvatar && !isSentByCurrentUser && (
								<Box
									component="span"
									color={"#2694AB"}
									sx={{
										fontSize: {
											xs: "13px",
											sm: "16px",
										},
										userSelect: "none",
									}}>
									{selectedConversation?.fullName}
								</Box>
							)}
							<Box
								id={item._id}
								component="span"
								sx={{
									fontSize: {
										xs: "13px",
										sm: "15px",
									},
									userSelect: {
										xs: "none",
										lg: "auto",
									},
								}}>
								{item.message}
							</Box>
							<Box
								variant={"caption"}
								sx={{
									position: "relative",
									bottom: {
										xs: "2px",
										sm: "5px",
									},
									right: "3px",
									fontSize: {
										xs: "8px",
										sm: "11px",
									},
									textAlign: "right",
									height: "4px",
									userSelect: "none",
								}}>
								{formattedDate}
							</Box>
						</Stack>
					</Stack>
				);
			})}
		</>
	);
};

export default MessageComp;
