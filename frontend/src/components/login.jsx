import React, { useState } from "react";
import { Alert, Input, Button, Heading, VStack } from "@chakra-ui/react";
import { host } from "../connection";

function Login({ setUid }) {
	const [password, setPassword] = useState("");
	const [passwordTest, setPasswordTest] = useState("");
	const [username, setUsername] = useState("");
	const [status, setStatus] = useState("");
	const [isHovered, setIsHovered] = useState(false);
	const [isRegisterMode, setIsRegisterMode] = useState(false);

	const handlePasswordChange = (event) => {
		setPassword(event.target.value);
	};
	const handlePasswordTestChange = (event) => {
		setPasswordTest(event.target.value);
	};
	const handleUsernameChange = (event) => {
		setUsername(event.target.value);
	};
	const handleSubmit = async (event) => {
		event.preventDefault();
		if (isRegisterMode && password !== passwordTest) {
			setStatus("Passwords don't match");
			return
		}
		const endpoint = isRegisterMode ? '/new_user' : '/login';
		const action = isRegisterMode ? 'registering' : 'logging in';

		try {
			const response = await fetch(host + endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password }),
			});
			const resData = await response.json();
			console.log(resData.id);
			if (response.ok) {
				setStatus(`Success ${action}!`);
				if (!isRegisterMode) {
					setUid(resData.id); // Only set UID if logging in
				}
			} else {
				setStatus(resData.message || `Error ${action}`);
			}
		} catch (error) {
			setStatus(`Error ${action}: ` + error.message);
		}
	};

	return (
		<div style={styles.formContainer}>
			<form style={styles.form} onSubmit={handleSubmit}>
				<Heading size={"sm"}>{isRegisterMode ? "Register" : "Login"}</Heading>
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
				{ isRegisterMode ?
				<Input
					type="password"
					placeholder="Password"
					value={passwordTest}
					onChange={handlePasswordTestChange}
					required
					style={styles.input}
				/> : <></> }
				<Button
					type="submit"
					style={{
						...styles.button,
						...(isHovered && styles.buttonHover)
					}}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				>
					{isRegisterMode ? "Register" : "Login"}
				</Button>
				<Button
					onClick={() => setIsRegisterMode(!isRegisterMode)}
					style={styles.toggleButton}
				>
					{isRegisterMode ? "Already have an account? Login" : "Don't have an account? Register"}
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
	},
	toggleButton: {
		marginTop: '10px',
		color: '#007bff',
		backgroundColor: 'transparent',
		cursor: 'pointer',
		textDecoration: 'underline',
		border: 'none'
	}
};

