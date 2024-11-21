import { useState, useEffect } from 'react';
import PasswordCell from './passwordCell';
import { Heading, Input, Alert, IconButton } from '@chakra-ui/react';
import AddPassword from './AddPassword'
import { MdAdd, MdRefresh } from "react-icons/md";
import { host } from '../connection';
interface PasswordsProps {
	token: string
}
interface PasswordEntry {
  id: number;
  platform: string;
  user: string;
  password: string;
}

const Passwords = ({ token }: PasswordsProps) => {
	const [query, setQuery] = useState("");
	const [status, setStatus] = useState("");
	const [entries, setEntries] = useState<PasswordEntry[]>([]);
	const [addingPassword, setAddingPassword] = useState(false);
	useEffect(() => {
		if (status !== '') {
			setTimeout(() => setStatus(''), 4000)
		}
	}, [status])
	const deletePassword = async (id: number) => {
		if (isNaN(id)) {
			setStatus("Invalid entry, must be an id (int)")
		}
		console.log(id)
		try {
			console.log(`Making request to /del_password`)
			const response = await fetch(host + '/del_password', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({ id }),
			});
			const resData = await response.json()
			fetchPasswords()
			console.log(resData.message + "This one")
			setStatus(resData.message)
		} catch (error) {
			setStatus('Error deleting password:' + error)
		}
	};
	const updateEntryFunc = async (id: number, jsonString: string) => {
		try {
			const response = await fetch(host + '/update_password/' + id, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: jsonString
			});
			const data = await response.json();
			setStatus(data.message)
		} catch (error) {
			setStatus('Error updating entry: ' + error);
		}
		setTimeout(() => fetchPasswords(), 200);
		
	}
	const fetchPasswords = async () => {
		try {
			const response = await fetch(host + `/get_password?query=${encodeURIComponent(query)}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
			});
			const data = await response.json();
			setEntries(data);
		} catch (error) {
			setStatus('Error fetching passwords: ' + error);
		}
		console.log(token);
	};

	useEffect(() => {
		fetchPasswords();
	}, [query]);
	return (
		<div style={{ alignItems: "center", height: "100vh", width: "50vw" }}>
			<Heading>Passwords</Heading>
			<div style={{ display: "inline-flex" }}>
				<Input
					type="text"
					placeholder="Query"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
				<IconButton
					aria-label={"Refresh the passwords list"}
					icon={<MdRefresh />}
					onClick={() => fetchPasswords()}
					color={"blue"}
				/>

			</div>
			{status && <Alert>{status}</Alert>}
			{(
				<ul>
					<PasswordCell
						key={-1}
						id={-1}
						password="Password"
						platform="Platform"
						username="Username"
						isTop={true}
					/>
					{entries.length > 0 && entries.map((entry) => (
						<PasswordCell
							key={entry.id}
							id={entry.id}
							password={entry.password}
							platform={entry.platform}
							username={entry.user}
							deleteFunc={deletePassword}
							updateFunc={updateEntryFunc}
						/>
					))}
				</ul>
			)}
			{addingPassword ?
				<AddPassword token={token} setAddingPassword={setAddingPassword} setStatus={setStatus} />
				:
				<IconButton
					colorScheme={'blue'}
					aria-label={'Add a new password'}
					icon={<MdAdd />}
					onClick={() => setAddingPassword(true)}
				/>
			}
		</div>
	);
};

export default Passwords;
