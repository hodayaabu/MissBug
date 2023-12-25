// Car CRUDL API
import { userService } from './user.service.js';

// List
export async function getUsers(req, res) {
    try {
        const users = await userService.query()
        res.send(users)
    } catch (err) {
        res.status(400).send(`Couldn't get users`)
    }
}

// Get
export async function getUserBugs(req, res) {
    const { userId } = req.params
    try {
        const userBugs = await userService.getUserBugs(userId)
        res.send(userBugs)
    } catch (err) {
        res.status(400).send(`Couldn't get the user`)
        console.log(err);
    }
}

// Delete
export async function removeUser(req, res) {
    const { userId } = req.params
    try {
        await userService.remove(userId)
        res.send('Deleted OK')
    } catch (err) {
        console.log(err);
        res.status(400).send(`Couldn't remove user`)
    }
}

// Save
export async function addUser(req, res) {
    const { fullname, username, password } = req.body
    const userToSave = { fullname, username, password }

    try {
        const savedUser = await userService.add(userToSave)
        res.send(savedUser)
    } catch (err) {
        res.status(400).send(`Couldn't save user`)
    }
}

//Update
export async function updateUser(req, res) {
    console.log(req.body);
    const { _id, fullname, username, password, score } = req.body
    const userToSave = { _id, fullname, username, password, score }
    try {
        const savedUser = await userService.update(userToSave, req.loggedinUser)
        res.send(savedUser)
    } catch (err) {
        res.status(400).send(`Couldn't save user`)
    }
}