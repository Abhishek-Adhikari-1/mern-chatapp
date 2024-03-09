import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";

export const getUsersForSideBar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;
		const conversations = await Conversation.find({
			participants: loggedInUserId,
		});

		const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
			"-password"
		);

		const usersWithLastMessages = await Promise.all(
			users.map(async (user) => {
				const conversation = conversations.find((conv) =>
					conv.participants.some(
						(participantId) =>
							participantId.toString() === user._id.toString()
					)
				);

				let lastMessage = conversation
					? conversation.lastMessage
					: null;

				return {
					user: user.toObject(),
					lastMessage: lastMessage,
				};
			})
		);

		res.status(200).json(usersWithLastMessages);
	} catch (error) {
		console.log("Error in getUsersForSideBar: ", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// export const getUsersForSideBar = async (req, res) => {
// 	try {
// 		const loggedInUserId = req.user._id;

// 		const conversations = await Conversation.find({
// 			participants: loggedInUserId,
// 		});

// 		const userIds = conversations.reduce((acc, conv) => {
// 			const otherParticipants = conv.participants.filter(
// 				(participantId) =>
// 					participantId.toString() !== loggedInUserId.toString()
// 			);
// 			acc.push(...otherParticipants);
// 			return acc;
// 		}, []);

// 		const users = await User.find({ _id: { $in: userIds } }).select(
// 			"-password"
// 		);

// 		const usersWithLastMessages = await Promise.all(
// 			users.map(async (user) => {
// 				const conversation = conversations.find((conv) =>
// 					conv.participants.some(
// 						(participantId) =>
// 							participantId.toString() === user._id.toString()
// 					)
// 				);

// 				let lastMessage = conversation
// 					? conversation.lastMessage
// 					: null;

// 				return {
// 					user: user.toObject(),
// 					lastMessage: lastMessage,
// 				};
// 			})
// 		);

// 		res.status(200).json(usersWithLastMessages);
// 	} catch (error) {
// 		console.log("Error in getUsersForSideBar: ", error.message);
// 		res.status(500).json({ error: "Internal Server Error" });
// 	}
// };
