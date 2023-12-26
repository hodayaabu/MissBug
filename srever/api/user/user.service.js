import { ObjectId } from 'mongodb'

import { loggerService } from '../../services/logger.service.js'
import { dbService } from "../../services/db.service.js"
import { msgService } from '../msgs/msg.service.js'
import { bugService } from '../bugs/bug.service.js'

export const userService = {
    query,
    getById,
    remove,
    add,
    update,
    getByUsername
}

const collectionName = "user"

async function query() {
    try {
        const collection = await dbService.getCollection(collectionName)
        const users = await collection.find().toArray()
        return users
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function getById(userId) {

    try {
        const collection = await dbService.getCollection(collectionName)
        const user = await collection.findOne({ _id: new ObjectId(userId) })
        delete user.password

        user.givenMsgs = await msgService.query({ byUserId: new ObjectId(user._id) })
        user.givenMsgs = user.givenMsgs.map(msg => {
            delete msg.byUser
            return msg
        })

        return user
    } catch (err) {
        loggerService.error(`while finding user by id: ${userId}`, err)
        throw err
    }
}


//need to prevent delete user with bugs --- not working
async function remove(userId) {
    try {
        const collection = await dbService.getCollection(collectionName)
        const user = await collection.findOne({ _id: new ObjectId(userId) })

        // const usersBug = await bugService.getByCreator(userId)
        // if (usersBug) throw "could`t remove user with bugs"

        if (!user) throw `Couldn't find user with _id ${userId}`

        await collection.deleteOne({ _id: user._id })
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function update(user) {
    try {
        // peek only updatable properties
        const userToSave = {
            _id: new ObjectId(user._id), // needed for the returnd obj
            username: user.username,
            score: user.score,
        }
        const collection = await dbService.getCollection(collectionName)
        await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
        return userToSave
    } catch (err) {
        loggerService.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

async function add(user) {
    try {
        // peek only updatable fields!
        // No timestamps needed anymore.
        const userToAdd = {
            username: user.username,
            password: user.password,
            fullname: user.fullname,
            score: 100
        }
        const collection = await dbService.getCollection(collectionName)
        await collection.insertOne(userToAdd)
        return userToAdd
    } catch (err) {
        loggerService.error('cannot add user', err)
        throw err
    }
}

async function getByUsername(username) {
    const collection = await dbService.getCollection(collectionName)
    const user = await collection.findOne({ username })
    return user
}

