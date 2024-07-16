import { useState } from 'react'
import { useSignup } from '../hooks/useSignup.js'

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword ] = useState('');
    const {signup, error, isLoading } = useSignup()

    const handleSubmit = async (e) => {
        e.preventDefault();
       await signup(email, password);
    }

    return (
        <main> 
        <form className="signup" onSubmit={handleSubmit}>
            <h3>Sign up</h3>
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
            <button type='submit' disabled={isLoading}>Sign up</button>
            </div>
            {error && <div className="error">{error}</div>}
        </form>
        </main>
    )
}

export default Signup