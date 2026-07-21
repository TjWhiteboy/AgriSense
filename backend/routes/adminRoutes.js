const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/stats", adminController.getStats);
router.get("/users", adminController.getUsers);
router.delete("/users/:id", adminController.deleteUser);
router.get("/chats", adminController.getChats);

module.exports = router;
