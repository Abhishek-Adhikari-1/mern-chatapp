/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import {
	AppBar,
	Box,
	Toolbar,
	IconButton,
	Typography,
	Menu,
	MenuItem,
	Container,
	Avatar,
	Button,
	Tooltip,
	Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AdbIcon from "@mui/icons-material/Adb";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import Notifications from "../specific/Notifications";
import AddFriends from "../specific/AddFriends";
import useLogout from "./../../hooks/useLogout";
import { useAuthContext } from "../../context/AuthContext";

const pages = ["Products", "Pricing", "Blog"];

function ResponsiveAppBar() {
	const [toggleValue, setToggleValue] = useState({
		anchorElNav: null,
		anchorElUser: null,
		isNotificationOpen: false,
		isAddFriendsOpen: false,
	});
	const { loading, logout } = useLogout();
	const { authUser } = useAuthContext();

	const handleOpenNavMenu = (event) => {
		setToggleValue({ ...toggleValue, anchorElNav: event.currentTarget });
	};
	const handleOpenUserMenu = (event) => {
		setToggleValue({ ...toggleValue, anchorElUser: event.currentTarget });
	};

	const handleCloseNavMenu = () => {
		setToggleValue({ ...toggleValue, anchorElNav: null });
	};

	const handleCloseUserMenu = () => {
		setToggleValue({ ...toggleValue, anchorElUser: null });
	};

	return (
		<>
			{toggleValue.isNotificationOpen && (
				<Notifications
					toggleValue={toggleValue}
					setToggleValue={setToggleValue}
				/>
			)}
			{toggleValue.isAddFriendsOpen && (
				<AddFriends
					toggleValue={toggleValue}
					setToggleValue={setToggleValue}
				/>
			)}
			<AppBar
				position="static"
				sx={{
					height: "56px",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}>
				<Container maxWidth="xl">
					<Toolbar disableGutters>
						<AdbIcon
							sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
						/>
						<Typography
							variant="h6"
							noWrap
							component="a"
							href="/"
							sx={{
								mr: 2,
								display: { xs: "none", md: "flex" },
								fontFamily: "monospace",
								fontWeight: 700,
								letterSpacing: ".3rem",
								color: "inherit",
								textDecoration: "none",
							}}>
							LOGO
						</Typography>

						<Box
							sx={{
								flexGrow: 1,
								display: { xs: "flex", md: "none" },
							}}>
							<IconButton
								size="large"
								aria-label="account of current user"
								aria-controls="menu-appbar"
								aria-haspopup="true"
								onClick={handleOpenNavMenu}
								color="inherit">
								<MenuIcon />
							</IconButton>
							<Menu
								id="menu-appbar"
								anchorEl={toggleValue.anchorElNav}
								anchorOrigin={{
									vertical: "bottom",
									horizontal: "left",
								}}
								keepMounted
								transformOrigin={{
									vertical: "top",
									horizontal: "left",
								}}
								open={Boolean(toggleValue.anchorElNav)}
								onClose={handleCloseNavMenu}
								sx={{
									display: { xs: "block", md: "none" },
									userSelect: "none",
								}}>
								{pages.map((page) => (
									<MenuItem
										key={page}
										onClick={handleCloseNavMenu}>
										<Typography
											textAlign="center"
											sx={{
												userSelect: "none",
											}}>
											{page}
										</Typography>
									</MenuItem>
								))}
							</Menu>
						</Box>
						<AdbIcon
							sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
						/>
						<Typography
							variant="h5"
							noWrap
							component="a"
							href="/"
							sx={{
								mr: 2,
								display: { xs: "flex", md: "none" },
								flexGrow: 1,
								fontFamily: "monospace",
								fontWeight: 700,
								letterSpacing: ".3rem",
								color: "inherit",
								textDecoration: "none",
							}}>
							LOGO
						</Typography>
						<Box
							sx={{
								flexGrow: 1,
								display: { xs: "none", md: "flex" },
							}}>
							{pages.map((page) => (
								<Button
									key={page}
									onClick={handleCloseNavMenu}
									sx={{
										my: 2,
										color: "white",
										display: "block",
									}}>
									{page}
								</Button>
							))}
						</Box>

						<Box sx={{ flexGrow: 0, display: "flex" }}>
							<Box
								sx={{ marginRight: "1.5rem", display: "flex" }}>
								<Tooltip title="Add Friends">
									<IconButton
										size="large"
										aria-label="show 4 new mails"
										color="inherit"
										onClick={() => {
											setToggleValue({
												...toggleValue,
												isAddFriendsOpen: true,
											});
										}}>
										<Badge badgeContent={4} color="error">
											<PeopleAltIcon />
										</Badge>
									</IconButton>
								</Tooltip>
								<Tooltip title="Notifications">
									<IconButton
										size="large"
										aria-label="show more than 9 new notifications"
										color="inherit"
										onClick={() => {
											setToggleValue({
												...toggleValue,
												isNotificationOpen: true,
											});
										}}>
										<Badge
											badgeContent={"9+"}
											color="error">
											<NotificationsIcon />
										</Badge>
									</IconButton>
								</Tooltip>
							</Box>
							<Tooltip title="Open settings">
								<IconButton
									onClick={handleOpenUserMenu}
									sx={{ p: 0 }}>
									<Avatar
										alt="Abhishek Adhikari"
										src={authUser.profilePic}
									/>
								</IconButton>
							</Tooltip>
							<Menu
								sx={{
									mt: "45px",
									userSelect: "none",
								}}
								id="menu-appbar"
								anchorEl={toggleValue.anchorElUser}
								anchorOrigin={{
									vertical: "top",
									horizontal: "right",
								}}
								keepMounted
								transformOrigin={{
									vertical: "top",
									horizontal: "right",
								}}
								open={Boolean(toggleValue.anchorElUser)}
								onClose={handleCloseUserMenu}>
								<MenuItem
									onClick={handleCloseUserMenu}
									sx={{
										userSelect: "none",
									}}>
									<Typography
										textAlign="center"
										sx={{
											color: "rgb(65, 72, 72)",
											userSelect: "none",
										}}>
										Profile
									</Typography>
								</MenuItem>
								<MenuItem
									onClick={handleCloseUserMenu}
									sx={{
										userSelect: "none",
									}}>
									<Typography
										textAlign="center"
										sx={{
											color: "rgb(65, 72, 72)",
											userSelect: "none",
										}}>
										Dashboard
									</Typography>
								</MenuItem>
								<MenuItem
									onClick={handleCloseUserMenu}
									sx={{
										userSelect: "none",
									}}>
									<Typography
										textAlign="center"
										sx={{
											color: "rgb(65, 72, 72)",
											userSelect: "none",
										}}>
										Settings
									</Typography>
								</MenuItem>
								<MenuItem
									onClick={async () => {
										await logout();
										handleCloseUserMenu;
									}}
									sx={{
										userSelect: "none",
									}}>
									<Typography
										textAlign="center"
										sx={{
											color: "rgb(65, 72, 72)",
											userSelect: "none",
										}}>
										{loading ? "Logging out..." : "Logout"}
									</Typography>
								</MenuItem>
							</Menu>
						</Box>
					</Toolbar>
				</Container>
			</AppBar>
		</>
	);
}
export default ResponsiveAppBar;
