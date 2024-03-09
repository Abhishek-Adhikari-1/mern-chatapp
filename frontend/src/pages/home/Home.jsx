/* eslint-disable react-refresh/only-export-components */
import { Box, Button, Container, Tooltip } from "@mui/material";
import AppLayout from "../../components/layout/AppLayout";
import MapsUgcIcon from "@mui/icons-material/MapsUgc";
import { memo, Suspense, lazy, useState } from "react";

import ChatList from "./../../components/shared/ChatList";
import AddFriends from "../../components/specific/AddFriends";

const Chat = lazy(() => import("../chat/Chat"));

const Home = (props) => {
	const [toggleValue, setToggleValue] = useState({
		isAddFriendsOpen: false,
	});
	return (
		<div>
			{props.active === "home" &&
				homeFun({ toggleValue, setToggleValue })}
			{props.active === "chat" && (
				<Suspense
					fallback={
						<Container
							component={"main"}
							maxWidth="sx"
							sx={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								alignItems: "center",
								height: "100dvh",
								overflow: "hidden",
								position: "absolute",
								top: 0,
								left: 0,
								backgroundColor: "rgba(0,0,0,0.4)",
								zIndex: 100,
							}}>
							<div style={{ transform: "scale(2.5)" }}>
								<svg viewBox="25 25 50 50" className="loader">
									<circle
										r="20"
										cy="50"
										cx="50"
										style={{ stroke: "black" }}></circle>
								</svg>
							</div>
						</Container>
					}>
					<Chat />
				</Suspense>
			)}
		</div>
	);
};

const homeFun = ({ toggleValue, setToggleValue }) => {
	return (
		<>
			{toggleValue.isAddFriendsOpen && (
				<AddFriends
					toggleValue={toggleValue}
					setToggleValue={setToggleValue}
				/>
			)}
			<Container
				maxWidth="lg"
				sx={{
					display: { xs: "none", sm: "flex" },
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					height: "calc(100dvh - 72px)",
				}}>
				<MapsUgcIcon
					sx={{
						fontSize: "55px",
						color: " rgb(46, 51, 63)",
					}}
				/>
				<Box sx={{ color: "rgb(65, 67, 90)", mb: 1 }}>
					Send private photos and messages to a friend or group.
				</Box>
				<Tooltip title="Start a new chat with friends">
					<Button
						variant="contained"
						sx={{
							backdropFilter: "blur(5px)",
						}}
						onClick={() => {
							setToggleValue({
								...toggleValue,
								isAddFriendsOpen: true,
							});
						}}>
						Send Message
					</Button>
				</Tooltip>
			</Container>
			<Container
				maxWidth="xs"
				sx={{
					display: { xs: "flex", sm: "none" },
					height: "calc(100dvh - 76px)",
					mt: "10px",
					p: 2,
					overflowX: "hidden",
					overflowY: "auto",
				}}>
				<ChatList />
			</Container>
		</>
	);
};

export default AppLayout()(memo(Home));
