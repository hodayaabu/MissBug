import { useNavigate } from 'react-router'

export function LoginSignup() {
    const navigate = useNavigate()

    function onClickLogin() {
        navigate('/login')
    }

    return (
        <div className="login-page">
            <p>
                <button className="btn-link" onClick={onClickLogin}>Login</button>
            </p>

        </div>
    )
}