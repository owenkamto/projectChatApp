const express = require("express")
const { registerUser, authUser, allUsers, renameUser} = require('../controllers/userControllers');
const { protect } = require("../middleware/authMiddleware")

const router = express.Router();
router.route('/').post(registerUser).get(protect, allUsers)
router.post('/login', authUser)
router.route("/rename").put(protect, renameUser)

module.exports = router;