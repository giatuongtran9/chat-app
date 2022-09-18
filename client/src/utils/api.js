// export const host = "http://localhost:8000"
export const host = "https://tuongtran-chatapp.herokuapp.com/api"
export const loginRoute = "/auth/login";
export const registerRoute = "/auth/register"
export const getAllUsers = `${host}/auth/allUsers`
export const getUser = `${host}/auth/getUser`
export const getAllMessages = '/messages/getmsg'
export const addMessage = '/messages/addmsg'
export const setAva = `${host}/auth/setAvatar`
export const logout = `${host}/auth/logout`