import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'
import mongodb from 'mongodb'
const { ObjectId } = mongodb

export const msgService = {
    query,
    remove,
    add
}

const collectionName = 'msg'

async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection(collectionName)

        var msgs = await collection.aggregate([{
            $match: criteria
        },
        {
            $lookup: {
                localField: 'byUserId',
                from: 'user',
                foreignField: '_id',
                as: 'byUser'
            }
        },
        {
            $unwind: '$byUser'
        },
        {
            $lookup: {
                localField: 'aboutUserId',
                from: 'user',
                foreignField: '_id',
                as: 'aboutUser'
            }
        },
        {
            $unwind: '$aboutUser'
        },
        {
            $project: {
                _id: true,
                txt: true,
                "byUser._id": true,
                "byUser.fullname": true,
                "aboutUser._id": true,
                "aboutUser.fullname": true
            }
        }
        ]).toArray()

        return msgs
    } catch (err) {
        loggerService.error('cannot find msgs', err)
        throw err
    }

}

async function remove(msgId, loggedinUser) {
    try {
        const collection = await dbService.getCollection(collectionName)
        // remove only if user is owner/admin
        const criteria = { _id: new ObjectId(msgId) }
        if (!loggedinUser.isAdmin) criteria.byUserId = new ObjectId(loggedinUser._id)

        const { deletedCount } = await collection.deleteOne(criteria)
        if (deletedCount < 1) {
            throw 'Cannot remove msg, not yours'
        }
        return deletedCount
    } catch (err) {
        loggerService.error(`cannot remove msg ${msgId}`, err)
        throw err
    }
}

async function add(msg) {
    try {
        const msgToAdd = {
            byUserId: new ObjectId(msg.byUserId),
            aboutUserId: new ObjectId(msg.aboutUserId),
            txt: msg.txt
        }
        const collection = await dbService.getCollection('msg')
        await collection.insertOne(msgToAdd)
        return msgToAdd
    } catch (err) {
        loggerService.error('cannot insert msg', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.byUserId) criteria.byUserId = filterBy.byUserId
    return criteria
}

