import { ObjectId } from 'mongodb'

import { loggerService } from '../../services/logger.service.js'
import { dbService } from "../../services/db.service.js"
import { utilService } from "../../services/util.service.js"


export const bugService = {
    query,
    getById,
    getByCreator,
    remove,
    save,
    addBugMsg,
    removeBugMsg
}

const collectionName = "bug"
const PAGE_SIZE = 5

async function query(filterBy = {}, sortBy = {}) {

    try {
        const criteria = _buildCriteria(filterBy)

        const collection = await dbService.getCollection(collectionName)

        const bugCursor = await collection.find(criteria)

        if (filterBy.pageIdx !== undefined) {
            const startIdx = filterBy.pageIdx * PAGE_SIZE
            bugCursor.skip(startIdx).limit(PAGE_SIZE)
        }

        if (sortBy) _sortBugs(bugCursor, sortBy)

        const bugs = bugCursor.toArray()

        return bugs
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function getById(bugId) {
    try {

        const collection = await dbService.getCollection(collectionName)
        const bug = await collection.findOne({ _id: new ObjectId(bugId) })

        if (!bug) throw `Couldn't find bug with _id ${bugId}`
        return bug
    } catch (err) {
        loggerService.error(err)
        throw (err)
    }
}

async function getByCreator(userId) {
    try {

        const collection = await dbService.getCollection(collectionName)
        const bugs = await collection.find({ creator: { _id: new ObjectId(userId) } })
        if (!bugs) throw `Couldn't find bugs with creator _id ${userId}`
        return bugs
    } catch (err) {
        loggerService.error(err)
        throw (err)
    }
}

async function remove(bugId, loggedinUser) {
    try {
        const collection = await dbService.getCollection(collectionName)
        const bug = await collection.findOne({ _id: new ObjectId(bugId) })

        if (!bug) throw `Couldn't find bug with _id ${bugId}`

        if (!loggedinUser.isAdmin && bug.creator._id !== loggedinUser._id) throw `Not your bug!`

        await collection.deleteOne({ _id: new ObjectId(bugId) })

    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function save(bug, loggedinUser) {
    try {
        const collection = await dbService.getCollection(collectionName)

        if (bug._id) {

            const bugToSave = {
                title: bug.title,
                severity: bug.severity,
                description: bug.description,
                labels: bug.labels
            }

            const oldBug = await collection.findOne({ _id: new ObjectId(bug._id) })
            if (!oldBug) throw `Couldn't find bug with _id ${bug._id}`

            if (!loggedinUser.isAdmin && oldBug.creator._id !== loggedinUser._id) throw `Not your bug!`

            await collection.updateOne({ _id: new ObjectId(oldBug._id) }, { $set: bugToSave })

        } else {
            bug.creator = loggedinUser
            await collection.insertOne(bug)
        }
        return bug
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function addBugMsg(bugId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection(collectionName)
        await collection.updateOne({ _id: new ObjectId(bugId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        loggerService.error(`cannot add bug msg ${bugId}`, err)
        throw err
    }
}

async function removeBugMsg(bugId, msgId) {
    try {
        const collection = await dbService.getCollection(collectionName)
        await collection.updateOne({ _id: new ObjectId(bugId) }, { $pull: { msgs: { id: msgId } } })
        return msgId
    } catch (err) {
        loggerService.error(`cannot add bug msg ${bugId}`, err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}

    if (filterBy.title) {
        criteria.title = { $regex: filterBy.title, $options: 'i' }
    }

    if (filterBy.minSeverity) {
        criteria.minSeverity = { $gt: filterBy.minSeverity }
    }

    if (filterBy.labels) {
        criteria.labels = { $regex: filterBy.labels, $options: 'i' }
    }


    return criteria
}

function _sortBugs(bugs, sortBy) {
    if (sortBy.by === 'title') {
        bugs.sort({ title: sortBy.dir })
    } else if (sortBy.by === 'severity') {
        bugs.sort({ severity: sortBy.dir })
    }
}