import React, { useState, useEffect } from 'react';
import PasswordCell from './passwordCell';
import { Heading, Button, Input, Alert, IconButton } from '@chakra-ui/react';
import AddPassword from './AddPassword'
import { MdAdd, MdRefresh } from "react-icons/md";
import { host } from '../connection';
const Passwords = ({ uid }) => {
	const [query, setQuery] = useState("");
	const [status, setStatus] = useState("");
	const [entries, setEntries] = useState([]);
	const [addingPassword, setAddingPassword] = useState(false);
	useEffect(() => {
		if (status !== '') {
			setTimeout(() => setStatus(''), 4000)
		}
	}, [status])
	const deletePassword = async (id) => {
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
	const updateEntryFunc = async (id, jsonString) => {
		try {
			const response = await fetch(host + '/update_password/' + id, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: jsonString
			});
			const data = await response.json();
			fetchPasswords()
			setStatus(data.message)
		} catch (error) {
			setStatus('Error updating entry:', error);
		}
	}
	const fetchPasswords = async () => {
		try {
			const response = await fetch(host + `/get_password/${uid}?query=${encodeURIComponent(query)}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			const data = await response.json();
			setEntries(data);
		} catch (error) {
			setStatus('Error fetching passwords: ' + error);
		}
	};

	useEffect(() => {
		fetchPasswords();
	}, [query]);
	return (
		<div style={{ alignItems: "center" }}>
			<Heading>Passwords</Heading>
			<div>
				<IconButton
					icon={<MdRefresh/>}
					onClick={() => fetchPasswords()}
					color={"blue"}
				/>
				<Input
					type="text"
					placeholder="Query"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
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
				<AddPassword uid={uid} setAddingPassword={setAddingPassword} setStatus={setStatus} />
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
