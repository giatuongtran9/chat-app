import  User from "../models/user.js"
import bcrypt from "bcryptjs"

export const login = async (req, res, next) => {
    try {
        const {username } = req.body
        const user = await User.findOne({ username })

        if (!user) {
            return res.status(404).json({ msg: "User not exist"})
        }

        const checkPassword = await bcrypt.compare(req.body.password, user.password)

        if (!checkPassword) {
            return res.status(400).json({ msg: "Incorrect password"})
        }

        const { password, ...others} = user._doc;

        res.status(200).json({msg: "Sign in successfully", user: others})

    } catch (err) {
        next(err)
    }
}

export const register = async (req, res, next) => {
    try {
        const { username, email, password} = req.body;

        const user = await User.findOne({ username });
        const userEmail = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ msg: "User already exist"})
        }

        if (userEmail) return res.status(400).json({ msg: "Email already exist "})

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        
        const newUser = new User({...req.body, password: hash})

        await newUser.save()
        res.status(200).json({msg: "User has been created"})
    } catch (err) {
        next(err)
    }
}

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.id }}).select(["email", "username", "avatarImg", "_id"])
    
        return res.status(200).json(users)
    } catch (err) {
        next(err)
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select(["email", "username", "avatarImg", "_id"])

        return res.status(200).json(user)
    } catch (err) {
        next(err)
    }
}

export const setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const avatarImg = req.body.image;
        const updated = await User.findByIdAndUpdate(userId, {
            isAvatarSet: true,
            avatarImg
        }, { new: true })

        return res.json({
            isSet: updated.isAvatarSet,
            image: updated.avatarImg
        })
    } catch (err) {
        next(err)
    }
}

export const logout = async (req, res, next) => {
    try {
        if (!req.params.id) return res.json({ msg: "User Id is required"})
        onlineUsers.delete(req.params.id)

        return res.status(200).json({ msg: "Log out successfully"})
    } catch (err) {
        next(err)
    }
}