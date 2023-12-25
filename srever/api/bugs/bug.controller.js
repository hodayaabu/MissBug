// Car CRUDL API
import { bugService } from './bug.service.js';

// List
export async function getBugs(req, res) {
    try {
        // const filterBy = {
        //     title: req.query.filterBy.title || '',
        //     minSeverity: +req.query.filterBy.minSeverity || 0,
        //     labels: req.query.filterBy.labels || '',
        //     pageIdx: req.query.filterBy.pageIdx || undefined
        // }
        // const sortBy = req.query.sortBy || {}

        // const bugs = await bugService.query(filterBy, sortBy)
        const bugs = await bugService.query()

        // console.log(bugs);
        res.send(bugs)
    } catch (err) {
        res.status(400).send(`Couldn't get bugs`)
        console.log(err);
    }
}

// Get
export async function getBug(req, res) {
    const { bugId } = req.params
    let visitedBugs = req.cookies.visitedBugs || []
    const checkedId = visitedBugs.findIndex((visitedBug) => visitedBug === bugId)
    if (checkedId === -1) visitedBugs.push(bugId)

    if (visitedBugs.length > 3) return res.status(401).send('Wait for a bit')

    try {
        const bug = await bugService.getById(bugId)
        res.cookie('visitedBugs', visitedBugs, { maxAge: 1000 * 7 })
        res.send(bug)
    } catch (err) {
        res.status(400).send(`Couldn't get the bug`)
    }
}

// // Delete
export async function removeBug(req, res) {
    const { bugId } = req.params

    try {
        await bugService.remove(bugId, req.loggedinUser)
        res.send({ msg: 'Deleted OK', deletedCount })
    } catch (err) {
        res.status(400).send(err)
        console.log(err);
    }

}

// // Add
export async function addBug(req, res) {
    const { title, severity, description, labels } = req.body
    const bugToSave = { title, severity, description, labels }

    try {
        const savedBug = await bugService.save(bugToSave, req.loggedinUser)
        res.send(savedBug)
    } catch (err) {
        res.status(400).send(`Couldn't save bug`)
        console.log(err);
    }
}

// // Update
export async function updateBug(req, res) {
    const { _id, title, severity, description, createdAt, labels } = req.body
    const bugToSave = { _id, title, severity: +severity, description, createdAt: +createdAt, labels }
    try {
        const savedBug = await bugService.save(bugToSave, req.loggedinUser)
        res.send(savedBug)
    } catch (err) {
        res.status(400).send(`Couldn't save bug`)
        console.log(err);
    }
}

export async function addBugMsg(req, res) {
    const { loggedinUser } = req
    try {
        const { bugId } = req.params

        const msg = {
            txt: req.body.txt,
            by: loggedinUser
        }

        const savedMsg = await bugService.addBugMsg(bugId, msg)
        res.json(savedMsg)
    } catch (err) {
        loggerService.error('Failed to update bug', err)
        res.status(400).send({ err: 'Failed to update bug' })

    }
}

export async function removeBugMsg(req, res) {
    try {
        const { msgId, bugId } = req.params

        const removedId = await bugService.removeBugMsg(bugId, msgId)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove bug msg', err)
        res.status(400).send({ err: 'Failed to remove bug msg' })

    }
}