import React from 'react'
import SignUp from './signup/Signup'
import Login from './login/Login'
import Main from './main/Main'
import { useSelector, useDispatch } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import { useNavigate } from 'react-router-dom'

const theme = createTheme({
	palette: {
		primary: {
			main: '#6495ed'
		}, 
		secondary: {
			main: '#344f7e'
		}
	}
})

const App = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const showLoginPage = useSelector(state => state.globalProps.showLoginPage)

	React.useEffect(() => {
		if (!JSON.parse(localStorage.getItem('details'))) {
			navigate('/signup')
		}
	}, [])
	const [height, setHeight] = React.useState(`${window.innerHeight}px`)
	const root = document.querySelector('#root')
	root.style.height = height

	window.addEventListener('resize', () => {
		setHeight(`${window.innerHeight}px`)
	})

	return (
		<ThemeProvider theme={theme}>
			<Routes>
				{JSON.parse(localStorage.getItem('details')) && <Route path='*' element={<Main /> } />}
				<Route path='/signup' element={<SignUp /> } />
				<Route path='/login' element={<Login /> } />
			</Routes>
		</ThemeProvider>
	)
}

export default App