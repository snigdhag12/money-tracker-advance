import { Link } from 'react-router-dom'
import '../App.css';
import { useLogout } from '../hooks/useLogout'
import {useAuthContext} from '../hooks/useAuthContext'

const Navbar = () => {
    const { logout } = useLogout();
    const { user } = useAuthContext();

    const handleClick = () => {
        logout();
    }
  return (
    <header>
      <div className="container">
        <nav>
        <Link to="/">Home</Link>
          <div>
          {
            !user && 
            <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
            </>
          }
            {user &&
                <>
                <span> {user.email} </span>
                <Link to="/"  onClick={handleClick} >Logout</Link>
                </>
            }
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Navbar