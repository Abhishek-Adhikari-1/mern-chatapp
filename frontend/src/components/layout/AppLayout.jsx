/* eslint-disable react/display-name */
import { Grid } from "@mui/material";
import Title from "../domManipulation/Title";
import { Suspense, lazy, memo } from "react";
import Header from "./Header";

const ChatList = lazy(() => import("./../shared/ChatList"));

const AppLayout = () => (WrappedComponent) => {
	return memo((props) => {
		return (
			<div
				style={{
					maxHeight: "100dvh",
					overflow: "hidden",
				}}>
				<Title />
				<Header />
				<Grid container height={"calc(100dvh - 56px)"}>
					<Grid
						item
						sx={{
							display: { xs: "none", sm: "flex" },
							flexDirection: "column",
							borderRight: "1px solid rgb(0, 0, 0, 0.25)",
							boxSizing: "border-box",
							padding: " 10px 20px",
							overflowX: "hidden",
							overflowY: "auto",
						}}
						sm={4}
						lg={3}
						height={"100%"}>
						<Suspense
							fallback={
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										justifyContent: "center",
										alignItems: "center",
										height: "100dvh",
										overflow: "hidden",
									}}>
									<div
										style={{
											transform: "scale(2)",
										}}>
										<svg
											viewBox="25 25 50 50"
											className="loader">
											<circle
												r="20"
												cy="50"
												cx="50"
												style={{
													stroke: "black",
												}}></circle>
										</svg>
									</div>
								</div>
							}>
							<ChatList />
						</Suspense>
					</Grid>
					<Grid
						item
						sm={8}
						lg={9}
						height={"100%"}
						sx={{
							boxSizing: "border-box",
							width: "100%",
						}}>
						<WrappedComponent {...props} />
					</Grid>
				</Grid>
			</div>
		);
	});
};

export default AppLayout;
