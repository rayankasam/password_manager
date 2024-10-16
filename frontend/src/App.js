import React, { useState } from 'react';
import './App.css';
import Passwords from './components/Passwords.jsx'
import TestConnection from './components/TestConnection.jsx';
import Login from './components/login.jsx';
import { ChakraProvider } from '@chakra-ui/react';

function App() {
	const [uid, setUid] = useState(-1)
	return (
		<ChakraProvider>
				{uid !== -1 ? 
					<>
						<Passwords uid={uid}/>
					</> 
					: 
					<Login setUid={setUid} />
				}
				<TestConnection />
		</ChakraProvider>
	);
}

export default App;
