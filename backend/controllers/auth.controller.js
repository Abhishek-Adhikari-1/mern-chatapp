import generateTokenAndSetCookie from "../utilities/generateToken.js";
import User from "./../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
	try {
		const { fullName, username, password, confirmPassword, gender } =
			req.body;

		if (
			!fullName ||
			!username ||
			!password ||
			!confirmPassword ||
			!gender
		) {
			return res.status(400).json({ error: "All fields are required" });
		}

		const fullNameRegex = /^[a-zA-Z ]+$/;
		if (!fullNameRegex.test(fullName)) {
			return res
				.status(400)
				.json({ error: "Full name must contain only alphabets" });
		}

		const usernameRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!usernameRegex.test(username)) {
			return res
				.status(400)
				.json({ error: "Username must be a valid email address" });
		}

		if (password.length < 6) {
			return res
				.status(400)
				.json({ error: "Password must be at least 6 characters" });
		}

		if (password !== confirmPassword) {
			return res.status(400).json({ error: "Passwords do not match" });
		}

		const user = await User.findOne({ username });

		if (user) {
			return res.status(400).json({ error: "User already exists" });
		}

		const salt = await bcryptjs.genSalt(10);
		const hashedPassword = await bcryptjs.hash(password, salt);

		const profilePic = `https://avatar.iran.liara.run/public/${
			gender === "male" ? "boy" : "girl"
		}?username=${username}`;

		const newUser = new User({
			fullName,
			username,
			password: hashedPassword,
			gender,
			profilePic,
		});

		if (newUser) {
			generateTokenAndSetCookie(newUser._id, res);
			await newUser.save();

			res.status(200).json({
				message: `Account created as: ${newUser.fullName}`,
				_id: newUser._id,
				fullName: newUser.fullName,
				username: newUser.username,
				profilePicture: newUser.profilePicture,
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
	} catch (error) {
		console.log("Error in signup controller: ", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const login = async (req, res) => {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			return res.status(400).json({ error: "All fields are required" });
		}

		const user = await User.findOne({ username });

		const isPasswordValid = await bcryptjs.compare(
			password,
			user?.password || ""
		);

		if (!user || !isPasswordValid) {
			return res
				.status(400)
				.json({ error: "Invalid username or password" });
		}

		generateTokenAndSetCookie(user._id, res);

		res.status(200).json({
			message: `Welcome ${user.fullName}`,
			_id: user._id,
			fullName: user.fullName,
			username: user.username,
			profilePic: user.profilePic,
		});
	} catch (error) {
		console.log("Error in login controller: ", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const logout = (req, res) => {
	try {
		res.clearCookie("token");
		
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller: ", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
