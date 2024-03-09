import generateTokenAndSetCookie, {
	generateTokenAndSetCookieForForgot,
} from "../utilities/generateToken.js";
import User from "./../models/user.model.js";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "adhikaryabhishek209@gmail.com",
		pass: "hlvozctqavykwhjr",
	},
});

// Signup using Abstract API
export const signup = async (req, res) => {
	try {
		const { fullName, email, password, confirmPassword, gender } = req.body;

		if (
			!fullName.trim() ||
			!email.trim() ||
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
		if (!usernameRegex.test(email)) {
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

		const validationResponse = await fetch(
			`https://emailvalidation.abstractapi.com/v1/?api_key=e5549f9aaf1842c086df0a983e6a1bc0&email=${email}`
		);
		const validationData = await validationResponse.json();

		var newEmail = email;
		if (validationData.autocorrect !== "") {
			newEmail = validationData.autocorrect;
		}

		if (
			!validationData.is_valid_format.value ||
			!validationData.is_smtp_valid.value ||
			!validationData.is_valid_format.value
		)
			return res.status(400).json({
				error: `${validationData.email} is not a valid email`,
			});

		if (validationData.deliverability !== "DELIVERABLE")
			return res.status(400).json({
				error: `${validationData.email} can't recieve any mail or invalid mail address`,
			});

		const user = await User.findOne({ email: newEmail });

		if (user) {
			return res.status(400).json({ error: "User already exists" });
		}

		const salt = await bcryptjs.genSalt(10);
		const hashedPassword = await bcryptjs.hash(password, salt);

		const profilePic = `https://avatar.iran.liara.run/public/${
			gender === "male" ? "boy" : "girl"
		}?username=${newEmail}`;

		const newUser = new User({
			fullName,
			email: newEmail,
			password: hashedPassword,
			gender,
			profilePic,
		});

		if (newUser) {
			generateTokenAndSetCookie(newUser._id, res);
			await newUser.save();

			res.status(200).json({
				message: `Account created for: ${newUser.email} as ${newUser.fullName}`,
				_id: newUser._id,
				fullName: newUser.fullName,
				email: newUser.email,
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
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ error: "All fields are required" });
		}

		const user = await User.findOne({ email });

		const isPasswordValid = await bcryptjs.compare(
			password,
			user?.password || ""
		);

		if (!user || !isPasswordValid) {
			return res.status(400).json({ error: "Invalid email or password" });
		}

		generateTokenAndSetCookie(user._id, res);

		res.status(200).json({
			message: `Welcome ${user.fullName}`,
			_id: user._id,
			fullName: user.fullName,
			email: user.email,
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

export const forgot = async (req, res) => {
	try {
		const { email } = req.body;

		if (!email.trim()) {
			return res.status(400).json({ error: "All fields are required" });
		}
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ error: "Invalid email" });
		}

		const code = Math.floor(10000 + Math.random() * 90000);

		const emailOptions = {
			from: "adhikaryabhishek209@gmail.com",
			to: email,
			subject: "Password Reset: MERN Chat App",
			html: `
				<!DOCTYPE html>
				<html>
				<head>
					<style>
						.button {
							background-color: #7b3dbd;
							border: none;
							color: #fff !important;
							padding: 10px 20px;
							text-align: center;
							text-decoration: none;
							display: inline-block;
							font-size: 16px;
							cursor: pointer;
							outline: none;
							border-radius: 8px;
							user-select: none !important;
						}
						.button:hover{
							background-color: #652acbce;
						}
						p{
							font-weight: 400;
							font-size: 18px;
						}
						u{
							color: blue;
						}
						@media (max-width: 450px){
							p{
								font-size: 15px;
							}
							h2{
								font-size: 1.75em;
							}
						}
					</style>
				</head>
				<body>
					<p>The password reset code you requested is:</p>
					<h2>${code}</h2>
					<p>To reset your password, please follow the instructions below.</p>
					<br/>
					<li>Go back to the <a href="">website</a> and enter the code.</li>
					<br />
					<br />
					<p>For your security, <u>kindly do not share this password reset code with anyone else</u>.
					It is unique to your account and should remain confidential.
					<b>If you did not request this password reset, </b>please ignore this message.</p>
				</body>
				</html>
			`,
		};

		transporter.sendMail(emailOptions, async (error) => {
			if (error) {
				console.log(error);
				return res.status(500).json({ error: "Internal Server Error" });
			} else {
				user.token = code;
				await user.save();
				generateTokenAndSetCookieForForgot(user._id, res);
				res.status(200).json({
					message: `Password reset code sent to ${email}`,
				});
			}
		});
	} catch (error) {
		console.log("Error in forgot controller: ", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Signup using Hunter API
// export const signup = async (req, res) => {
// 	try {
// 		const { fullName, email, password, confirmPassword, gender } = req.body;

// 		if (!fullName || !email || !password || !confirmPassword || !gender) {
// 			return res.status(400).json({ error: "All fields are required" });
// 		}

// 		const fullNameRegex = /^[a-zA-Z ]+$/;
// 		if (!fullNameRegex.test(fullName)) {
// 			return res
// 				.status(400)
// 				.json({ error: "Full name must contain only alphabets" });
// 		}

// 		const usernameRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 		if (!usernameRegex.test(email)) {
// 			return res
// 				.status(400)
// 				.json({ error: "Username must be a valid email address" });
// 		}

// 		if (password.length < 6) {
// 			return res
// 				.status(400)
// 				.json({ error: "Password must be at least 6 characters" });
// 		}

// 		if (password !== confirmPassword) {
// 			return res.status(400).json({ error: "Passwords do not match" });
// 		}

// 		const validationResponse = await fetch(
// 			`https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${process.env.API_KEY}`
// 		);
// 		const validationData = await validationResponse.json();

// 		if (validationData.data.block) {
// 			return res.status(400).json({
// 				error: `Email address cant be verified bt SMTP server. Please try again later.`,
// 			});
// 		}

// 		if (!validationData.data.gibberish) {
// 			return res.status(400).json({
// 				error: `Please dont use automatically generated email address`,
// 			});
// 		}

// 		if (
// 			validationData.data.status !== "valid" ||
// 			validationData.data.result !== "deliverable"
// 		) {
// 			return res.status(400).json({
// 				error: `${validationData.data.email} is not a valid mail address`,
// 			});
// 		}

// 		if (!validationData.data.smtp_check) {
// 			return res.status(400).json({
// 				error: `${validationData.data.email} can't recieve any mail or invalid mail address`,
// 			});
// 		}

// 		const user = await User.findOne({ email });

// 		if (user) {
// 			return res.status(400).json({ error: "User already exists" });
// 		}

// 		const salt = await bcryptjs.genSalt(10);
// 		const hashedPassword = await bcryptjs.hash(password, salt);

// 		const profilePic = `https://avatar.iran.liara.run/public/${
// 			gender === "male" ? "boy" : "girl"
// 		}?username=${email}`;

// 		const newUser = new User({
// 			fullName,
// 			email,
// 			password: hashedPassword,
// 			gender,
// 			profilePic,
// 		});

// 		if (newUser) {
// 			generateTokenAndSetCookie(newUser._id, res);
// 			await newUser.save();

// 			res.status(200).json({
// 				message: `Account created for: ${newUser.email} as ${newUser.fullName}`,
// 				_id: newUser._id,
// 				fullName: newUser.fullName,
// 				email: newUser.email,
// 				profilePicture: newUser.profilePicture,
// 			});
// 		} else {
// 			res.status(400).json({ error: "Invalid user data" });
// 		}
// 	} catch (error) {
// 		console.log("Error in signup controller: ", error.message);
// 		res.status(500).json({ error: "Internal Server Error" });
// 	}
// };
