import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton } from "@mui/material";

const InputComp = (props) => {
	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};
	return (
		<div className="input-group">
			<label htmlFor={props.name}>
				{props.label}
				{props.required ? " *" : ""}
			</label>
			{props.type === "password" ? (
				<div
					className="passwordDiv"
					style={{
						display: "flex",
					}}>
					<input
						type={showPassword ? "text" : "password"}
						name={props.name}
						id={props.name}
						placeholder={props.placeholder}
						autoComplete={props.suggestion}
						required={props.required}
						onInput={props.onInput}
						value={props.value}
						style={{
							paddingRight: "40px",
						}}
					/>
					{props.value.trim() !== "" ? (
						<IconButton
							type="button"
							className="toggle-password"
							sx={{
								position: "absolute",
								right: 25,
							}}
							onClick={togglePasswordVisibility}>
							{showPassword ? <VisibilityOff /> : <Visibility />}
						</IconButton>
					) : (
						""
					)}
				</div>
			) : (
				<input
					type={props.type || "text"}
					name={props.name}
					id={props.name}
					placeholder={props.placeholder}
					autoComplete={props.suggestion}
					required={props.required}
					onInput={props.onInput || ""}
					value={props.value}
					style={props.style}
				/>
			)}
		</div>
	);
};

export default InputComp;
