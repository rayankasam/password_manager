import React, { useState } from "react";
import { Alert } from "@chakra-ui/react";

function Login({setLoggedIn}) {
	const [password, setPassword] = useState("");
	const [status, setStatus] = useState("");
	const [isHovered, setIsHovered] = useState(false);

	const handlePasswordChange = (event) => {
		setPassword(event.target.value);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		console.log("Password submitted:", password);
		if (password === "98ztr4jg") {
			setLoggedIn(true)
		}
		else {
			setStatus("Incorrect password")
			removeStatus()
		}
	};
	const removeStatus = async() => {
		await new Promise(r => setTimeout(r, 3000));
		setStatus("")
	}

	return (
		<div style={styles.formContainer}>
			<form style={styles.form} onSubmit={handleSubmit}>
				<h2>Login</h2>
				{status !== "" && <Alert status='error'>{status}</Alert>}
				<input
					type="password"
					placeholder="Enter your password"
					value={password}
					onChange={handlePasswordChange}
					required
					style={styles.input}
				/>
				<button
					type="submit"
					style={{
						...styles.button,
						...(isHovered && styles.buttonHover)
					}}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				>
					Submit
				</button>
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
