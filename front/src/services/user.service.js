import Axios from 'axios'

var axios = Axios.create({
    withCredentials: true,
})

// const BASE_USER_URL = '//localhost:3030/api/user/'
// const BASE_AUTH_URL = '//localhost:3030/api/auth/'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

// const BASE_URL = (window.process.env.NODE_ENV !== 'development') ?
//     '/api/' :
//     '//localhost:3030/api/'

const BASE_URL = '//localhost:3030/api/'

const BASE_USER_URL = BASE_URL + 'user/'
const BASE_AUTH_URL = BASE_URL + 'auth/'

export const userService = {
    getUsers,
    login,
    signup,
    logout,
    remove,
    update,
    getEmptyUser,
    getLoggedinUser,
    getBugsUser
}


async function getUsers() {
    var { data: users } = await axios.get(BASE_USER_URL)
    return users
}

async function getBugsUser(userId) {
    const url = BASE_USER_URL + userId

    var { data: bugs } = await axios.get(url)
    console.log(bugs);
    return bugs
}

async function update(userToUpdate) {

    const updatedUser = await axios.put(BASE_USER_URL, userToUpdate)
    if (getLoggedinUser()._id === updatedUser._id) saveLocalUser(updatedUser)
    return updatedUser
}

async function remove(userId) {
    const url = BASE_USER_URL + userId
    var { data: res } = await axios.delete(url)
    return res
}

async function login(credentials) {
    const { data: user } = await axios.post(BASE_AUTH_URL + 'login', credentials)
    console.log('user', user);
    if (user) {
        return saveLocalUser(user)
    }
    return null
}

async function signup(credentials) {

    const { data: user } = await axios.post(BASE_AUTH_URL + 'signup', credentials)
    return saveLocalUser(user)
}

async function logout() {
    await axios.post(BASE_AUTH_URL + 'logout')
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}


function getEmptyUser(fullname = "", username = "", password = "") {
    return { fullname, username, password }
}

function saveLocalUser(user) {
    user = { _id: user._id, fullname: user.fullname, isAdmin: user.isAdmin }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

