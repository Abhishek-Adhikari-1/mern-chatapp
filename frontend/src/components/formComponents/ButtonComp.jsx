const ButtonComp = (props) => {
	return (
		<button
			type={props.type || "button"}
			className="button"
			onClick={props?.onClick}
			disabled={props.isButtonDisabled}
			title={props.isButtonDisabled ? "Loading......." : ""}>
			{props.isButtonDisabled ? (
				<svg viewBox="25 25 50 50" className="loader">
					<circle r="20" cy="50" cx="50"></circle>
				</svg>
			) : (
				<span>{props.value}</span>
			)}
		</button>
	);
};

export default ButtonComp;
