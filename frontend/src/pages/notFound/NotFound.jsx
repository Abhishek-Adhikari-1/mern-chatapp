import { Button, Container } from "@mui/material";
import image from "../../assets/images/NotFound.svg";
import Title from "../../components/domManipulation/Title";

const NotFound = () => {
	return (
		<>
			<Title title="Page Not Found"/>
			<Container
				component={"main"}
				maxWidth="xs"
				sx={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					height: "100dvh",
				}}>
				<div
					className="header"
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "flex-end",
					}}>
					<p
						className="title"
						style={{
							fontSize: "4rem",
							fontWeight: 900,
							marginBottom: 20,
						}}>
						404
					</p>
					<p className="title">Page Not Found</p>
				</div>
				<img
					src={image}
					alt=""
					style={{
						width: "100%",
						maxWidth: "300px",
						margin: "0 auto",
					}}
				/>
				<div
					className="footer"
					style={{
						display: "grid",
						gap: "2rem",
						placeContent: "baseline",
					}}>
					<p
						style={{
							fontVariationSettings: "1rem",
						}}>
						Page you are trying to open does not exist. You may have
						mistyped the address, or the page has been moved to
						another URL. If you think this is an error contact
						support.
					</p>
					<Button variant="contained" href="/login">
						go to home page
					</Button>
				</div>
			</Container>
		</>
	);
};

export default NotFound;
