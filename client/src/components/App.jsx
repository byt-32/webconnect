import React from 'react'
import SignUp from './signup/Signup'
import Login from './login/Login'
import Main from './main/Main'
import { useSelector, useDispatch } from 'react-redux'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'

import RightPane from './main/rightPane/RightPane'

import {getWindowHeight} from '../lib/script'

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

	React.useEffect(() => {
		if (!JSON.parse(localStorage.getItem('details'))) {
			navigate('/login')
		}
	}, [])
	
	return (
		<ThemeProvider theme={theme}>
			<section style={{height: getWindowHeight() + 'px'}} >
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