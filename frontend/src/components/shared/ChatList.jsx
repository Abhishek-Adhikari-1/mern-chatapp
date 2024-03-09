import { Box, Skeleton, Stack } from "@mui/material";
import useGetConversation from "../../hooks/useGetConversation";
import InputComp from "../formComponents/InputComp";
import { useState, lazy, Suspense } from "react";
import { useParams } from "react-router-dom";

const delayedImport = () =>
	new Promise((resolve) =>
		setTimeout(() => {
			resolve(import("./ChatItem"));
		}, 1500)
	);

const ChatItem = lazy(delayedImport);

const ChatList = () => {
	const [search, setSearch] = useState({
		searchQuery: "",
		searchResults: [],
	});
	const { conversations } = useGetConversation();

	const { chatid } = useParams();

	const handleSearch = (e) => {
		e.preventDefault();
		const query = e.target.value;
		setSearch((prevSearch) => ({
			...prevSearch,
			searchQuery: query,
			searchResults: query
				? conversations.filter(
						(conversation) =>
							conversation.user.fullName
								?.toLowerCase()
								.includes(query.trim().toLowerCase())
						// eslint-disable-next-line no-mixed-spaces-and-tabs
				  )
				: [],
		}));
	};

	return (
		<>
			<Stack width={"100%"} direction={"column"}>
				<InputComp
					name={"searchChatList"}
					type={"search"}
					placeholder={"Search friends..."}
					onInput={handleSearch}
					value={search.searchQuery}
				/>
				{conversations?.map((item, index) => (
					<Suspense
						fallback={
							<>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										width: "100%",
										position: "relative",
										margin: "5px 0",
									}}>
									<Skeleton
										variant="rounded"
										width={"100%"}
										height={80}
										animation="wave"
										sx={{
											backgroundColor:
												"rgba(255,255,255,0.3)",
										}}
									/>
									<Skeleton
										variant="circular"
										animation="wave"
										width={40}
										height={40}
										sx={{
											position: "absolute",
											top: "50%",
											left: "1rem",
											transform: "translateY(-50%)",
										}}
									/>
									<Skeleton
										variant="text"
										sx={{
											fontSize: "1.5rem",
											position: "absolute",
											width: "calc(100% - 40px - 2rem - 10px)",
											right: "20px",
											bottom: "32px",
										}}
									/>
									<Skeleton
										variant="text"
										sx={{
											fontSize: "1rem",
											position: "absolute",
											width: "calc(100% - 40px - 2rem - 10px)",
											right: "20px",
											bottom: "14px",
										}}
									/>
								</Box>
							</>
						}
						key={`chatList-${index}`}>
						{search.searchQuery === "" && (
							<ChatItem
								user={item.user}
								lastMessage={item.lastMessage}
								isActive={chatid === item.user._id}
								chatid={chatid}
								chatUser={chatid === item.user._id && item.user}
							/>
						)}
					</Suspense>
				))}
				{search.searchResults.map((s, i) => {
					return (
						<ChatItem
							key={i}
							user={s.user}
							lastMessage={s.lastMessage}
							isActive={chatid === s.user._id}
							chatid={chatid}
							chatUser={chatid === s.user._id && s.user}
						/>
					);
				})}
			</Stack>
		</>
	);
};

export default ChatList;
