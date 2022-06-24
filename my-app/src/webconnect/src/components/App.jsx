import React from 'react'
import SignUp from './signup/Signup'
import Login from './login/Login'
import Main from './main/Main'
import { useSelector, useDispatch } from 'react-redux'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import LeftPane from './main/leftPane/LeftPane'
import RightPane from './main/rightPane/RightPane'
import {useWindowHeight} from '../customHooks/hooks'

const theme = createTheme({
	palette: {
		type: 'light',
		primary: {
			main: '#6495ed',
		}, 
		secondary: {
			main: '#344f7e'
		},
		headerInput: {
			main: 'transparent'
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
	
	return (
		<ThemeProvider theme={theme}>
			<section style={{height: useWindowHeight()}} >
				<Routes>
					{JSON.parse(localStorage.getItem('details')) && 
						<Route path='/' element={<Main /> } > 
							<Route path='/chat' element={<RightPane />} />
						</Route>
					}
					<Route path='/signup' element={<SignUp /> } />
					<Route path='/login' element={<Login /> } />
				</Routes>
			</section>
		</ThemeProvider>
	)
}

export default App