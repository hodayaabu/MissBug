import { loggerService } from '../../services/logger.service.js'
import { userService } from '../user/user.service.js'
import { authService } from '../auth/auth.service.js'
import { msgService } from './msg.service.js'

export async function getMsgs(req, res) {
    try {
        const msgs = await msgService.query(req.query)
        res.send(msgs)
    } catch (err) {
        loggerService.error('Cannot get msgs', err)
        res.status(400).send({ err: 'Failed to get msgs' })
    }
}

export async function deleteMsg(req, res) {
    try {
        const deletedCount = await msgService.remove(req.params.id, req.loggedinUser)
        res.send({ msg: 'Deleted successfully', deletedCount })
    } catch (err) {
        loggerService.error('Failed to delete msg', err)
        res.status(400).send({ err })
    }
}


export async function addMsg(req, res) {

    var { loggedinUser } = req

    try {
        var msg = req.body
        msg.byUserId = loggedinUser._id
        msg = await msgService.add(msg)

        // prepare the updated msg for sending out
        msg.aboutUser = await userService.getById(msg.aboutUserId)

        loggedinUser = await userService.update(loggedinUser)
        msg.byUser = loggedinUser

        // User info is saved also in the login-token, update it
        const loginToken = authService.getLoginToken(loggedinUser)
        res.cookie('loginToken', loginToken)

        delete msg.aboutUserId
        delete msg.byUserId

        res.send(msg)

    } catch (err) {
        loggerService.error('Failed to add msg', err)
        console.log(err);
        res.status(400).send({ err: 'Failed to add msg' })
    }
}