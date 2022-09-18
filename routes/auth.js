import { login, register, getAllUsers, setAvatar, logout, getUser } from "../controllers/authController.js";

import express from 'express';

const router = express.Router();

router.post("/login", login);

router.post("/register", register);

router.get("/allUsers/:id", getAllUsers)

router.get("/getuser/:id", getUser)

router.get("/logout/:id", logout)

router.post("/setAvatar/:id", setAvatar)

export default router