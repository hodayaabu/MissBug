import { ObjectId } from 'mongodb'

import { loggerService } from '../../services/logger.service.js'
import { dbService } from "../../services/db.service.js"
import { msgService } from '../msgs/msg.service.js'

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

// async function getUserBugs(userId) {
//     try {
//         const userBugs = bugs.filter((bug) => bug.creator._id === userId)

//         if (!userBugs) throw `Couldn't find user's bugs with _id ${userId}`
//         return userBugs
//     } catch (err) {
//         loggerService.error(err)
//         throw (err)
//     }
// }


//need to privent delete user with bugs --- not working
async function remove(userId) {
    try {
        const collection = await dbService.getCollection(collectionName)
        const user = await collection.findOne({ _id: new ObjectId(userId) })

        if (!user) throw `Couldn't find user with _id ${userId}`

        await collection.deleteOne({ _id: user._id })
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

// async function save(userToSave, loggedinUser) {
//     try {
//         const collection = await dbService.getCollection(collectionName)
//         if (userToSave._id) {

//             const newUser = {
//                 _id: new ObjectId(userToSave._id),
//                 username: userToSave.username,
//                 fullname: userToSave.severity,
//                 score: userToSave.score
//             }

//             const oldUser = await collection.findOne({ _id: new ObjectId(userToSave._id) })
//             if (!oldUser) throw `Couldn't find user with _id ${userToSave._id}`

//             if (!loggedinUser.isAdmin) throw `Not an admin!`
//             await collection.updateOne({ _id: new ObjectId(oldUser._id) }, { $set: newUser })

//         } else {
//             userToSave.score = 100
//             userToSave.isAdmin = false
//             await collection.insertOne(userToSave)

//         }
//         return userToSave
//     } catch (err) {
//         loggerService.error(err)
//         throw err
//     }
// }

async function update(user) {
    try {
        // peek only updatable properties
        const userToSave = {
            _id: new ObjectId(user._id), // needed for the returnd obj
            fullname: user.fullname,
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

