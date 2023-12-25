import { userService } from '../services/user.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { UserList } from '../cmps/UserList.jsx'
import { useState, useEffect } from 'react'

export function UserIndex() {
    const [users, setUsers] = useState([])
    useEffect(() => {
        loadUsers()
    }, [users])

    async function loadUsers() {
        const users = await userService.getUsers()
        setUsers(users)
    }

    async function onRemoveUser(userId) {
        try {
            await userService.remove(userId)
            setUsers(prevUsers => prevUsers.filter((user) => user._id !== userId))
            showSuccessMsg('User removed')

        } catch (err) {
            console.log('Error from onRemoveUser ->', err)
            showErrorMsg('Cannot remove user')
        }
    }

    async function onEditUser(user) {
        const username = prompt('New User-Name?')
        const userToSave = { ...user, username }

        try {
            const savedUser = await userService.update(userToSave)
            setUsers(prevUsers => prevUsers.map((currUser) =>
                currUser._id === savedUser._id ? savedUser : currUser
            ))
            showSuccessMsg('User updated')

        } catch (err) {
            console.log('Error from onEditUser ->', err)
            showErrorMsg('Cannot update user')
        }
    }

    if (!users) return <div>Loading...</div>
    return (
        <main className="main-layout">
            <h3>Users</h3>
            <main>
                <UserList users={users} onRemoveUser={onRemoveUser} onEditUser={onEditUser} />
            </main>
        </main>
    )
}
