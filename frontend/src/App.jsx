import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { Container } from "@mui/material";
import { Toaster } from "react-hot-toast";
import Circles from "./components/circles/Circles";
import ProtectRoute from "./components/auth/ProtectRoute";
import { useAuthContext } from "./context/AuthContext";

const Login = lazy(() => import("./pages/login/Login"));
const Signup = lazy(() => import("./pages/signup/Signup"));
const Forgot = lazy(() => import("./pages/forgot/Forgot"));
const Home = lazy(() => import("./pages/home/Home"));
const NotFound = lazy(() => import("./pages/notFound/NotFound"));

const App = () => {
	const { authUser } = useAuthContext();
	return (
		<BrowserRouter>
			<Circles />
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
				<Routes>
					<Route
						path="/login"
						element={
							<ProtectRoute user={!authUser} redirect="/">
								{authUser ? (
									<Navigate to={"/"} />
								) : (
									<Login />
								)}
							</ProtectRoute>
						}
					/>
					<Route path="/signup" element={<Signup />} />
					<Route path="/forgot" element={<Forgot />} />
					<Route element={<ProtectRoute user={authUser} />}>
						<Route
							path="/"
							element={
								authUser ? (
									<Home active={"home"} />
								) : (
									<Navigate to={"/login"} />
								)
							}
						/>
						<Route
							path="/chat/:chatid"
							element={
								authUser ? (
									<Home active={"chat"} />
								) : (
									<Navigate to={"/login"} />
								)
							}
						/>
					</Route>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Suspense>
			<Toaster reverseOrder={true} />
		</BrowserRouter>
	);
};

export default App;
