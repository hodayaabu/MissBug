import { useState } from 'react'
import { userService } from '../services/user.service.js'
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { Link, useNavigate } from 'react-router-dom'


export function Signup() {
    const [credentials, setCredentials] = useState(userService.getEmptyUser())
    const navigate = useNavigate()

    async function onSignup(credentials) {
        try {
            const user = await userService.signup(credentials)
            showSuccessMsg(`Welcome ${user.fullname}`)
            navigate('/')
        } catch (err) {
            console.log('Cannot signup :', err)
            showErrorMsg(`Cannot signup: ${err}`)
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
        await onSignup(credentials)
        clearState()

    }

    return (
        <div className="login-signup-page">
            <form className="form-item" onSubmit={onSubmitForm}>
                <input
                    className='field'
                    type="text"
                    name="fullname"
                    value={credentials.fullname}
                    placeholder="Fullname"
                    onChange={handleChange}
                    required
                />
                <input
                    className='field'
                    type="text"
                    name="username"
                    value={credentials.username}
                    placeholder="Username"
                    onChange={handleChange}
                    required
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
                    <button >Signup!</button>
                    <Link className='link' to='/login'>Already have an account? Log in</Link>
                </div>

            </form>
        </div>
    )
}