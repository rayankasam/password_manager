import React, { useState } from 'react';
import { Input, Button, Heading, InputGroup, InputRightElement, IconButton } from '@chakra-ui/react';
import { MdRemove } from "react-icons/md";
import { host } from '../connection';
interface AddPasswordProps {
	uid: number,
	setAddingPassword: (value: boolean) => void,
	setStatus: (status: string) => void
}
const AddPassword = ({ uid, setAddingPassword, setStatus }: AddPasswordProps) => {
	const [platform, setPlatform] = useState('');
	const [user, setUser] = useState('');
	const [password, setPassword] = useState('');
	const [show, setShow] = useState(false);
	const handleClickShow = () => setShow(!show)
	const handleSubmit = async (e: any) => {
		e.preventDefault();
		if (platform === "") { setStatus("No platform"); return }
		if (user === "") { setStatus("No username"); return }
		if (password === "") { setStatus("No password"); return }
		const body = JSON.stringify({
			user_id: uid,
			platform,
			user,
			password,
		});
		console.log(body)
		const response = await fetch(host + '/add_password', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: body,
		});
		const data = await response.json();
		setStatus(data.message);
		setAddingPassword(false);
	};

	return (
		<div>
			<Heading>Add Password</Heading>
			<IconButton
				colorScheme={'red'}
				aria-label={"Don't add password"}
				icon={<MdRemove />}
				onClick={() => setAddingPassword(false)}
			/>
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
				<Button type="submit">Add</Button>
			</form>
		</div>
	);
};

export default AddPassword;
const formStyle: React.CSSProperties = {
	display: 'flex',
	alignItems: 'center',
	flexDirection: 'column'
};
