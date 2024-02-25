import { useEffect, useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'

import { UserMsg } from './UserMsg'
import { LoginSignup } from './LoginSignup.jsx'

import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { userService } from "../services/user.service"


export function AppHeader() {
  const [loggedinUser, setLoggedinUser] = useState(userService.getLoggedinUser())

  const navigate = useNavigate()

  useEffect(() => {
    setLoggedinUser(userService.getLoggedinUser())
  }, [])

  async function onLogout() {
    console.log('logout');
    try {
      await userService.logout()
      showSuccessMsg(`Goodbye ${loggedinUser.fullname}`)
      setLoggedinUser(null)
      navigate('/')
    } catch (err) {
      console.log('can not logout');
      showErrorMsg(`Cannot logout`)
    }
  }

  return (
    <header className='app-header '>
      <div className='header-container'>
        <h1>Bugs are Forever</h1>

        <nav className='app-nav'>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/bug">Bugs</NavLink>
          {loggedinUser?.isAdmin && <NavLink to="/user">Users</NavLink>}
        </nav>

        <section className="login-signup-container">
          {!loggedinUser && <LoginSignup />}
          {loggedinUser && <div className="user-preview">
            <Link to={`/user/${loggedinUser._id}`}><h3>Hello {loggedinUser.fullname}</h3></Link>

            <button onClick={onLogout}>Logout</button>

          </div>}
        </section>

      </div>
      <UserMsg />
    </header>
  )
}
