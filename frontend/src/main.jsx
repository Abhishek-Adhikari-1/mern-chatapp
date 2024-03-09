import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import App from "./App.jsx";
import { HelmetProvider } from "react-helmet-async";
import { AuthContextProvider } from "./context/AuthContext";
import { SocketContextProvider } from "./context/socketContext.jsx";

const theme = createTheme({
	palette: {
		primary: {
			main: "#7d52ff",
			hover: "#a166ff",
		},
	},
});

ReactDOM.createRoot(document.getElementById("root")).render(
	<AuthContextProvider>
		<HelmetProvider>
			<SocketContextProvider>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					{/* <div onContextMenu={(e) => e.preventDefault()}> */}
					<App />
					{/* </div> */}
				</ThemeProvider>
			</SocketContextProvider>
		</HelmetProvider>
	</AuthContextProvider>
);
