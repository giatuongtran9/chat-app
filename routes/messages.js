import { getMessages, sendMessage } from "../controllers/messagesController.js";

import express from 'express'

const router = express.Router();

router.post("/addmsg", sendMessage);
router.post("/getmsg", getMessages);

export default router