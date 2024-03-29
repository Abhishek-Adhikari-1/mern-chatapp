import { Container, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import InputComp from "./../../components/formComponents/InputComp";
import ButtonComp from "./../../components/formComponents/ButtonComp";
import Title from "../../components/domManipulation/Title";
import useForgot from "../../hooks/useForgot";

const Forgot = () => {
	const [inputs, setInputs] = useState({
		email: "",
	});

	const { loading, forgot } = useForgot();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await forgot(inputs);
	};
	return (
		<>
			<Title title={"Forgot Password Page"} />
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
				<Paper className="form-container" elevation={3}>
					<p className="title">Forgot Password</p>
					<form
						className="form"
						onSubmit={handleSubmit}>
						<InputComp
							name={"email"}
							type={"email"}
							label={"Email address"}
							placeholder={"Enter your email here"}
							suggestion={"email"}
							required
							value={inputs.email}
							onInput={(e) => {
								const sanitizedValue = e.target.value
									.toLowerCase()
									.replace(/\s/g, "");
								setInputs({
									...inputs,
									email: sanitizedValue,
								});
							}}
						/>

						<ButtonComp
							type={"submit"}
							value={"Send E-mail"}
							isButtonDisabled={loading}
						/>
					</form>
					<div className="social-message">
						<div className="line"></div>
						<div className="message">
							<p className="signup link">
								Remembered password? &nbsp;
								<Link to={"/login"}>Login</Link>
							</p>
						</div>
						<div className="line"></div>
					</div>
				</Paper>
			</Container>
		</>
	);
};

export default Forgot;
