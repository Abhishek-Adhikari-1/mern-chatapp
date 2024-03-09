/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
import { Suspense, lazy } from "react";
const AddFriendsItem = lazy(() => import("./AddFriendsItem"));
import { Container, Dialog, DialogTitle, Stack } from "@mui/material";

const AddFriends = ({ toggleValue, setToggleValue }) => {
	const handleClose = (event, reason) => {
		if (reason === "backdropClick" || reason === "escapeKeyDown") {
			setToggleValue({
				...toggleValue,
				isAddFriendsOpen: false,
			});
		}
	};
	return (
		<Dialog open={toggleValue.isAddFriendsOpen} onClose={handleClose}>
			<Stack
				sx={{
					width: {
						xs: "100%",
						sm: "26rem",
						lg: "30rem",
					},
					p: {
						xs: "1.3rem",
						sm: "1rem 2rem",
					},
					color: "rgb(65, 67, 90)",
				}}
				direction={"column"}>
				<DialogTitle>Find People</DialogTitle>
				<Suspense
					fallback={
						<Container
							component={"main"}
							maxWidth="xs"
							sx={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								alignItems: "center",
								height: "130px",
								width: "100%",
							}}>
							<div style={{ transform: "scale(1.7)" }}>
								<svg viewBox="25 25 50 50" className="loader">
									<circle r="20" cy="50" cx="50"></circle>
								</svg>
							</div>
						</Container>
					}>
					<AddFriendsItem />
				</Suspense>
			</Stack>
		</Dialog>
	);
};

export default AddFriends;
