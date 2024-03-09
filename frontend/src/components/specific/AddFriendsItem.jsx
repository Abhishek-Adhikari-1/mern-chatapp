import { Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InputComp from "./../formComponents/InputComp";

const AddFriendsItem = () => {
	return (
		<>
			<Box>
				<SearchIcon
					sx={{
						position: "absolute",
						transform: "translateY(13px) translateX(5px)",
						pointerEvents: "none",
					}}
				/>
				<InputComp
					name={"addFriends"}
					placeholder={"Search or add people..."}
					suggestion="off"
					style={{
						paddingLeft: "1.8rem",
					}}
				/>
			</Box>
		</>
	);
};

export default AddFriendsItem;
