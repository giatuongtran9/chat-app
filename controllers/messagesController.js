import Messages from '../models/messages.js'

export const getMessages = async (req, res, next) => {
    try {
        const { from, to } = req.body;

        const messages = await Messages.find({
            users: {
                $all: [from, to]
            }
        }).sort({ updatedAt: 1 })

        const allMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message
            }
        })

        res.status(200).json(allMessages)
    } catch (err) {
        next(err)
    }
}

export const sendMessage = async (req, res, next) => {
    try {
        const { from, to, message } = req.body;

        const mess = await Messages.create({
            message,
            users: [from, to],
            sender: from
        })

        if (mess) return res.status(200).json({ msg: "Message sent successfully"})
        else return res.json(400).json({msg: "Fail to add message to DB"})
    } catch (err) {
        next(err)
    }
}