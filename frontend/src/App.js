import React, { useState } from 'react';
import './App.css';
import Passwords from './components/Passwords.jsx'
import AddPassword from './components/AddPassword.jsx';
import TestConnection from './components/TestConnection.jsx';
import Login from './components/login.jsx';
import { ChakraProvider } from '@chakra-ui/react';

function App() {
	const [loggedIn, setLoggedIn] = useState(false)
	return (
		<ChakraProvider>
			<div className="App">
				{loggedIn ? <><Passwords />
					<AddPassword /> </> : <Login setLoggedIn={setLoggedIn} />}
				<TestConnection />
			</div>
		</ChakraProvider>
	);
}

export default App;
