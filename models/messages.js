import mongoose from 'mongoose'

const MessagesSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    users: Array,
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true})

export default mongoose.model("Messages", MessagesSchema)