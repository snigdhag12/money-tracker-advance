import { useState } from 'react'
import { useLogin } from '../hooks/useLogin'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword ] = useState('');
    const { login, error, isLoading } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        login(email, password);
        console.log(email, password);
    }

    return (
        <main>
        <form className="login" onSubmit={handleSubmit}>
            <h3>Log in</h3>
            <label>
                Email:
            </label>
            <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            />
            <label>
                Password:
            </label>
            <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            />
            <div className='button-class'>
            <button disabled={isLoading} type='submit'>Log in</button>
            </div>
            { error && <div className="error">{error}</div>}
        </form>
        </main>
    )
}

export default Login