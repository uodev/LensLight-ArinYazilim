import express from "express"
import {
  createUser,
  getDashboardPage,
  loginUser,
  getAllUsers,
  getAUsers,
  follow,
  unfollow,
} from "../controllers/userController.js"
import authMiddleware from "../middlewares/authMiddleware.js"

const router = express.Router()

router.route("/register").post(createUser)
router.route("/login").post(loginUser)
router
  .route("/dashboard")
  .get(authMiddleware.authenticateToken, getDashboardPage)

router.route("/").get(authMiddleware.authenticateToken, getAllUsers)
router.route("/:id").get(authMiddleware.authenticateToken, getAUsers)
router.route("/:id/follow").put(authMiddleware.authenticateToken, follow)
router.route("/:id/unfollow").put(authMiddleware.authenticateToken, unfollow)

export default router
