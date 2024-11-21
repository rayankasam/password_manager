import React, { useState } from "react";
import { Alert, Input, Button, Heading } from "@chakra-ui/react";
import { host } from "../connection";
interface LoginProps {
	setToken: (token: string) => void
}
function Login({ setToken: setToken }: LoginProps) {
	const [password, setPassword] = useState("");
	const [passwordTest, setPasswordTest] = useState("");
	const [username, setUsername] = useState("");
	const [status, setStatus] = useState("");
	const [isHovered, setIsHovered] = useState(false);
	const [isRegisterMode, setIsRegisterMode] = useState(false);

	const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value);
	};
	const handlePasswordTestChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPasswordTest(event.target.value);
	};
	const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(event.target.value);
	};
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
					setToken(resData.token); // Only set Token if logging in
				}
			} else {
				setStatus(resData.message || `Error ${action}`);
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				setStatus(`Error ${action}: ${error.message}`);
			} else {
				setStatus(`Error ${action}: Something went wrong`);
			}
		}

	};

	return (
		<div style={formContainerStyle}>
			<form style={formStyle} onSubmit={handleSubmit}>
				<Heading size={"sm"}>{isRegisterMode ? "Register" : "Login"}</Heading>
				{status !== "" && <Alert status='error'>{status}</Alert>}
				<Input
					type="username"
					placeholder="Username"
					value={username}
					onChange={handleUsernameChange}
					required
					style={inputStyle}
				/>
				<Input
					type="password"
					placeholder="Password"
					value={password}
					onChange={handlePasswordChange}
					required
					style={inputStyle}
				/>
				{isRegisterMode ?
					<Input
						type="password"
						placeholder="Password"
						value={passwordTest}
						onChange={handlePasswordTestChange}
						required
						style={inputStyle}
					/> : <></>}
				<Button
					type="submit"
					style={{
						...buttonStyle,
						...(isHovered && buttonHoverStyle)
					}}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				>
					{isRegisterMode ? "Register" : "Login"}
				</Button>
				<Button
					onClick={() => setIsRegisterMode(!isRegisterMode)}
					style={toggleButtonStyle}
				>
					{isRegisterMode ? "Already have an account? Login" : "Don't have an account? Register"}
				</Button>
			</form>
		</div>
	);
}

export default Login;

const formContainerStyle: React.CSSProperties = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	height: '100vh',
};

const formStyle: React.CSSProperties = {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	maxWidth: '300px',
	margin: '0 auto',
	padding: '20px',
	border: '1px solid #ccc',
	borderRadius: '10px',
	boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
	backgroundColor: 'white',
};

const inputStyle: React.CSSProperties = {
	marginBottom: '10px',
	padding: '10px',
	width: '100%',
	border: '1px solid #ccc',
	borderRadius: '5px',
	boxSizing: 'border-box',
};

const buttonStyle: React.CSSProperties = {
	padding: '10px',
	width: '100%',
	backgroundColor: '#007bff',
	color: 'white',
	border: 'none',
	borderRadius: '5px',
	cursor: 'pointer',
	fontSize: '16px',
};

const buttonHoverStyle: React.CSSProperties = {
	backgroundColor: '#0056b3',
};

const toggleButtonStyle: React.CSSProperties = {
	marginTop: '10px',
	color: '#007bff',
	backgroundColor: 'transparent',
	cursor: 'pointer',
	textDecoration: 'underline',
	border: 'none',
};
