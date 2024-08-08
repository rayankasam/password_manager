import React, { useState } from "react";
import { Alert, Input, Button, Heading } from "@chakra-ui/react";

function Login({ setUid }) {
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const [status, setStatus] = useState("");
	const [isHovered, setIsHovered] = useState(false);

	const handlePasswordChange = (event) => {
		setPassword(event.target.value);
	};
	const handleUsernameChange = (event) => {
		setUsername(event.target.value);
	};
	const handleSubmit = async (event) => {
		event.preventDefault();
		console.log("Password submitted:", password);
		try {
			const response = await fetch('/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password }),
			});
			const resData = await response.json()

			console.log(resData.message + response.ok)
			if (response.ok) {
				setUid(resData.id)
			}
			setStatus(resData.message)
		} catch (error) {
			setStatus('Error logging in:' + error)
		}
	};
	const removeStatus = async () => {
		await new Promise(r => setTimeout(r, 3000));
		setStatus("")
	}

	return (
		<div style={styles.formContainer}>
			<form style={styles.form} onSubmit={handleSubmit}>
				<Heading size={"sm"}>Login</Heading>
				{status !== "" && <Alert status='error'>{status}</Alert>}
				<Input
					type="username"
					placeholder="Username"
					value={username}
					onChange={handleUsernameChange}
					required
					style={styles.input}
				/>
				<Input
					type="password"
					placeholder="Password"
					value={password}
					onChange={handlePasswordChange}
					required
					style={styles.input}
				/>
				<Button
					type="submit"
					style={{
						...styles.button,
						...(isHovered && styles.buttonHover)
					}}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				>
					Submit
				</Button>
			</form>
		</div>
	);
}

export default Login;

const styles = {
	formContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: '100vh',
		backgroundColor: '#f0f0f0'
	},
	form: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		maxWidth: '300px',
		margin: '0 auto',
		padding: '20px',
		border: '1px solid #ccc',
		borderRadius: '10px',
		boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
		backgroundColor: 'white'
	},
	input: {
		marginBottom: '10px',
		padding: '10px',
		width: '100%',
		border: '1px solid #ccc',
		borderRadius: '5px',
		boxSizing: 'border-box'
	},
	button: {
		padding: '10px',
		width: '100%',
		backgroundColor: '#007bff',
		color: 'white',
		border: 'none',
		borderRadius: '5px',
		cursor: 'pointer',
		fontSize: '16px'
	},
	buttonHover: {
		backgroundColor: '#0056b3'
	}
};
