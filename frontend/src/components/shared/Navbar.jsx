import { NavLink } from 'react-router-dom'

function Navbar() {
	return (
		<header className="navbar">
			<nav className="navbar-nav">
				<NavLink to="/" end>
					Home
				</NavLink>
				<NavLink to="/about">About</NavLink>
			</nav>
		</header>
	)
}

export default Navbar
