import { useState } from 'react';
import './App.css';
import Passwords from './components/Passwords.jsx'
import Login from './components/login.jsx';
import { ChakraProvider } from '@chakra-ui/react';

function App() {
	const [token, setToken] = useState("")
	return (
		<ChakraProvider>
				{token !== "" ? 
					<>
						<Passwords token={token}/>
					</> 
					: 
					<Login setToken={setToken} />
				}
		</ChakraProvider>
	);
}

export default App;
