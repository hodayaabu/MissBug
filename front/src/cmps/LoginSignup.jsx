import { useState } from 'react'
import { userService } from '../services/user.service.js'
import { Login } from './Login.jsx'
import { useNavigate } from 'react-router'

export function LoginSignup({ onSignup, onLogin }) {
    // const [users, setUsers] = useState([])
    const [credentials, setCredentials] = useState(userService.getEmptyUser())
    const [isSignup, setIsSignup] = useState(false)

    const navigate = useNavigate()

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

    function clearState() {
        setCredentials(userService.getEmptyUser())
        setIsSignup(false)
    }

    function handleChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setCredentials({ ...credentials, [field]: value })
    }

    async function onSubmitForm(ev = null) {
        if (ev) ev.preventDefault()
        if (isSignup) {
            if (!credentials.username || !credentials.password || !credentials.fullname) return
            await onSignup(credentials)
        } else {
            if (!credentials.username || !credentials.password) return
            await onLogin(credentials)
        }
        clearState()

    }

    function onClickLogin() {
        navigate('/login')
    }


    return (
        <div className="login-page">
            <p>
                <button className="btn-link" onClick={onClickLogin}>Login</button>
            </p>

            {/* {!isSignup && <Login onLogin={onLogin} />} */}


            {/* {!isSignup &&
             <form className="login-form" onSubmit={onSubmitForm}>
                {/* <select
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                >
                    <option value="">Select User</option>
                    {users.map(user => <option key={user._id} value={user.username}>{user.fullname}</option>)}
                </select> */}
            {/* <input
                type="text"
                name="username"
                value={credentials.username}
                placeholder="Username"
                onChange={handleChange}
                required
                autoFocus
            />
            <input
                type="password"
                name="password"
                value={credentials.password}
                placeholder="Password"
                onChange={handleChange}
                required
            />
            <button>Login!</button> */}
            {/* </form>} */}

            {/* <div className="signup-section">
                {isSignup && <form className="signup-form" onSubmit={onSubmitForm}>
                    <input
                        type="text"
                        name="fullname"
                        value={credentials.fullname}
                        placeholder="Fullname"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="username"
                        value={credentials.username}
                        placeholder="Username"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        value={credentials.password}
                        placeholder="Password"
                        onChange={handleChange}
                        required
                    />

                    <button >Signup!</button>
                </form>}
            </div> */}
        </div>
    )
}