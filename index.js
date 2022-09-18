import express from "express"
import cors from 'cors'
import mongoose from "mongoose"
import dotenv from "dotenv"
import { Server } from 'socket.io'
import { createServer } from 'http'

import InMemorySessionStore from "./sessionStore.js"

import authRoutes from './routes/auth.js'
import messageRoutes from './routes/messages.js'
import User from "./models/user.js"
import crypto from "crypto"
import path, { dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const randomId = () => crypto.randomBytes(8).toString('hex')

const app = express();
dotenv.config()

const httpServer = createServer(app);
const sessionStore = new InMemorySessionStore()

app.use(cors())
app.use(express.json())

const connect = () => {
    mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("connected to DB"))
    .catch((err) => console.log(err))
}


// app.use("/api", (req, res) => {
//     res.send("Hello")
// })

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes)

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong"

    return res.status(status).json({
        success: false,
        status,
        message
    })
})

app.get("/api", (req, res) => {
    res.json({ message: 'Hello World'});
});

app.use(express.static(path.join(__dirname, "client/build")))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
})


const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000"
    }
})

io.use((socket, next) => {
    const user = socket.handshake.auth.user;
    const sessionID = socket.handshake.auth.sessionID

    if (sessionID) {
        const session = sessionStore.findSession(sessionID)

        if (session) {
            socket.sessionID = sessionID;

            return next();
        }
    }

    socket.user = user;

    socket.sessionID = randomId();
    socket.userID = randomId();
    next()
})

global.onlineUsers = new Map()

io.on("connection", async (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`)

    const user = socket.handshake.auth.user;

    socket.emit("session", {
        sessionID: socket.sessionID,
        userID: socket.userID,
        user
    })

    onlineUsers.set(user._id, socket.id)

    const users = await User.find({ _id: { $ne: user._id}}).lean().select(["email", "username", "avatarImg", "isAvatarSet"])
    

    socket.emit("user-list", users)

    socket.broadcast.emit("user-connected", {
        userID: socket.id,
        user
    })


    // const onlineUsers = []

    // for (let [id, socket] of io.of("/").sockets) {
    //     onlineUsers.push(
    //         socket.handshake.auth.user
    //     )
    // }

    socket.emit("online-users", onlineUsers)


    socket.on("send-msg", (data) => {

        socket.to(onlineUsers.get(data.to)).emit("msg-recieve", data.msg)

    })

    socket.on("disconnect", () => {
        console.log('🔥: A user disconnected');
        

    })
})

httpServer.listen(process.env.PORT, () => {
    connect()
    console.log(`Server listen on PORT ${process.env.PORT}`)
})