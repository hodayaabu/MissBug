import { useState } from 'react'
import { userService } from '../services/user.service.js'
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { Link } from 'react-router-dom'


export function Login() {
    // const [users, setUsers] = useState([])
    const [credentials, setCredentials] = useState(userService.getEmptyUser())

    // useEffect(() => {
    //     loadUsers()
    // }, [])

    // async function loadUsers() {
    //     try {
    //         const users = await userService.getUsers()
    //         setUsers(users)
    //     } catch (err) {
    //         console.log('Had issues loading users', err);
    //     }
    // }

    async function onLogin(credentials) {
        try {
            const user = await userService.login(credentials)
            showSuccessMsg(`Welcome ${user.fullname}`)
        } catch (err) {
            console.log('Cannot login :', err)
            showErrorMsg(`Cannot login`)
        }
    }

    function clearState() {
        setCredentials(userService.getEmptyUser())
    }

    function handleChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setCredentials({ ...credentials, [field]: value })
    }

    async function onSubmitForm(ev = null) {
        if (ev) ev.preventDefault()
        if (!credentials.username || !credentials.password || !credentials.fullname) return
        await onLogin(credentials)
        clearState()

    }

    return (
        <div className="login-signup-page">
            <form className="form-item" onSubmit={onSubmitForm}>
                {/* <select
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                >
                    <option value="">Select User</option>
                    {users.map(user => <option key={user._id} value={user.username}>{user.fullname}</option>)}
                </select> */}
                <input
                    className='field'
                    type="text"
                    name="username"
                    value={credentials.username}
                    placeholder="Username"
                    onChange={handleChange}
                    required
                    autoFocus
                />
                <input
                    className='field'
                    type="password"
                    name="password"
                    value={credentials.password}
                    placeholder="Password"
                    onChange={handleChange}
                    required
                />
                <div className="footer">
                    <button>Login!</button>
                    <Link className='link' to='/signup'>Create account</Link>
                </div>

            </form>

        </div>
    )
}