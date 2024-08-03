import React, { useState } from 'react';
import { host } from '../connection';
import { Input, Button, Heading, InputGroup, InputRightElement } from '@chakra-ui/react';
const AddPassword = () => {
	const [platform, setPlatform] = useState('');
	const [user, setUser] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');
	const [show, setShow] = useState(false);
	const handleClickShow = () => setShow(!show)
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (platform === "") { setMessage("No platform"); return }
		if (user === "") { setMessage("No username"); return }
		if (password === "") { setMessage("No password"); return }
		const response = await fetch(host + '/add_password', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				platform,
				user,
				password,
			}),
		});

		const data = await response.json();
		setMessage(data.message);
	};

	return (
		<div>
			<Heading>Add Password</Heading>
			<form onSubmit={handleSubmit} style={formStyle}>
				<Input
					type="text"
					placeholder="Platform"
					value={platform}
					onChange={(e) => setPlatform(e.target.value)}
				/>
				<Input
					type="text"
					placeholder="User"
					value={user}
					onChange={(e) => setUser(e.target.value)}
				/>
				<InputGroup>
					<Input
						type={show ? 'text' : 'password'}
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<InputRightElement width='4.5rem'>
						<Button h='1.75rem' size='sm' onClick={handleClickShow}>
							{show ? 'Hide' : 'Show'}
						</Button>
					</InputRightElement>
				</InputGroup>
				<button type="submit">Add</button>
			</form>
			{message && <p>{message}</p>}
		</div>
	);
};

export default AddPassword;
const formStyle = {
	display: 'flex',
	alignItems: 'center',
	flexDirection: 'column'
};
