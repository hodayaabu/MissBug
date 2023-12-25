import { useEffect, useState } from 'react'

import { BugList } from '../cmps/BugList.jsx'

import { userService } from '../services/user.service.js'
import { bugService } from '../services/bug.service.js'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'

export function UserDetails() {
    const loggedinUser = userService.getLoggedinUser()
    const [bugs, setBugs] = useState([])

    useEffect(() => {
        loadBugs()
    }, [])

    async function loadBugs() {
        setBugs(await userService.getBugsUser(loggedinUser._id))
    }
    console.log(bugs);
    async function onRemoveBug(bugId) {
        try {
            await bugService.remove(bugId)
            setBugs(prevBugs => prevBugs.filter((bug) => bug._id !== bugId))
            showSuccessMsg('Bug removed')

        } catch (err) {
            console.log('Error from onRemoveBug ->', err)
            showErrorMsg('Cannot remove bug')
        }
    }

    async function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }

        try {
            const savedBug = await bugService.save(bugToSave)
            setBugs(prevBugs => prevBugs.map((currBug) =>
                currBug._id === savedBug._id ? savedBug : currBug
            ))
            showSuccessMsg('Bug updated')

        } catch (err) {
            console.log('Error from onEditBug ->', err)
            showErrorMsg('Cannot update bug')
        }
    }

    if (!loggedinUser) return <h1>loadings....</h1>
    return <div className="user-details main-layout">
        <h3>User Details</h3>
        <h4><strong>User-Name:</strong> {loggedinUser.fullname}</h4>
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
    </div>

}

