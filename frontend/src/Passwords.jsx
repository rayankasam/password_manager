import React, { useState, useEffect } from 'react';
import PasswordCell from './passwordCell';
import { host } from '../connection';
const Passwords = () => {
	const [query, setQuery] = useState('');
	const [status, setStatus] = useState('');
	const [entries, setEntries] = useState([]);
	const updateEntryFunc = async (id, jsonString) => {
		try {
			const response = await fetch(host + '/update_password/' + id, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: jsonString
			});
			fetchPasswords()
			setStatus(response)
		} catch (error) {
			setStatus('Error updating entry:', error);
		}
	}
	const deletePassword = async (id) => {
		if (isNaN(id)) {
			setStatus("Invalid entry, must be an id (int)")
		}
		console.log(id)
		try {
			console.log(`Making request to ${host + '/del_password'}`)
			const response = await fetch(host + '/del_password', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id
				}),
			});
			const resData = await response.json()
			fetchPasswords()
			console.log(resData.message)
			setStatus(resData.message)
		} catch (error) {
			setStatus('Error fetching passwords:' + error)
		}
	};

	const fetchPasswords = async () => {
		let query_url = query === "" ? "~" : query
		try {
			const response = await fetch(host + '/get_password/' + query_url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			const data = await response.json();
			setEntries(data.entries);
		} catch (error) {
			setStatus('Error fetching passwords:', error);
		}
	};
	useEffect(() => {
		fetchPasswords();
	}, [query]);
	return (
		<div>
			<h2>Passwords</h2>
			<div>
				<button onClick={() => fetchPasswords()}>Refresh</button>
				<input
					type="text"
					placeholder="Query"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>

			</div>
			{status !== '' && <p>{status}</p>}
			{(
				<ul>
					<PasswordCell
						key={-1}
						id={-1}
						password="Password"
						platform="Platform"
						username="Username"
						hideDel={true}
					/>
					{entries.length > 0 && entries.map((entry) => (
						<PasswordCell
							key={entry.id}
							id={entry.id}
							password={entry.password}
							platform={entry.platform}
							username={entry.user}
							updateFunc={updateEntryFunc}
							deleteFunc={deletePassword}
						/>
					))}
				</ul>
			)}
		</div>
	);
};

export default Passwords;
