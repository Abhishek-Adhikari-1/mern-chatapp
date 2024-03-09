/* eslint-disable react/prop-types */
import { Suspense, lazy } from "react";
const NotificationItems = lazy(() => import("./NotificationItems"));
import { Container, Dialog, DialogTitle, Stack } from "@mui/material";

const Notifications = ({ toggleValue, setToggleValue }) => {
	const handleClose = (event, reason) => {
		if (reason === "backdropClick" || reason === "escapeKeyDown") {
			setToggleValue({
				...toggleValue,
				isNotificationOpen: false,
			});
		}
	};
	return (
		<Dialog open={toggleValue.isNotificationOpen} onClose={handleClose}>
			<Stack
				sx={{
					width: {
						xs: "100%",
						sm: "28rem",
						md: "30rem",
					},
					p: {
						xs: "0.7rem",
						sm: "1rem 2rem",
					},
					color: "rgb(44, 45, 54)",
				}}>
				<DialogTitle
					sx={{
						borderBottom: "1px solid rgba(192, 190, 190, 0.7)",
					}}>
					Notifications
				</DialogTitle>
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
					<NotificationItems />
				</Suspense>
			</Stack>
		</Dialog>
	);
};

export default Notifications;
