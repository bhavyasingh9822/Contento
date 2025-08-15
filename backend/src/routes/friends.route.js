// routes/friends.js
import express from "express";
import User from "../models/User.js";

const router = express.Router();

// POST /api/friends/add
router.post("/add", async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    if (!userId || !friendId) {
      return res.status(400).json({ message: "Both IDs required" });
    }

    if (userId === friendId) {
      return res.status(400).json({ message: "You can't add yourself" });
    }

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.friends.includes(friendId)) {
      return res.status(400).json({ message: "Already friends" });
    }

    // Add to both users' friend lists (bidirectional)
    user.friends.push(friendId);
    friend.friends.push(userId);

    await user.save();
    await friend.save();

    res.status(200).json({ message: "Friend added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
