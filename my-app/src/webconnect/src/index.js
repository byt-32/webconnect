import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './Redux/store'
import { BrowserRouter } from 'react-router-dom'
import { Notifications } from 'react-push-notification';

import App from './components/App'

ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>,
document.querySelector('#root'))