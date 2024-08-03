import React, { useState } from 'react';
import { host } from '../connection';
const AddPassword = () => {
	const [platform, setPlatform] = useState('');
	const [user, setUser] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');

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
			<h2>Add Password</h2>
			<form onSubmit={handleSubmit} style={formStyle}>
				<input
					type="text"
					placeholder="Platform"
					value={platform}
					onChange={(e) => setPlatform(e.target.value)}
				/>
				<input
					type="text"
					placeholder="User"
					value={user}
					onChange={(e) => setUser(e.target.value)}
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
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
