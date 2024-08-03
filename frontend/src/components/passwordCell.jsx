import React, { useState } from "react";
import { Spoiler } from 'react-spoiler-tag';
import 'react-spoiler-tag/dist/index.css';
import { Button, Input } from "@chakra-ui/react";
import { MdEdit, MdDeleteOutline, MdCheck } from "react-icons/md";
const PasswordCell = ({ id, platform, username, password, updateFunc, deleteFunc, isTop = false }) => {
	const [editing, setEditing] = useState(false)
	const [platformEdit, setPlatformEdit] = useState(platform)
	const [usernameEdit, setUsernameEdit] = useState(username)
	const [passwordEdit, setPasswordEdit] = useState(password)
	const handleConfirmEdit = () => {
		const updatedEntry = {}
		if (platformEdit !== platform) {
			updatedEntry.platform = platformEdit
			console.log("New platform is: " + platformEdit)
		}
		if (usernameEdit !== username) {
			updatedEntry.username = usernameEdit
			console.log("New username is: " + usernameEdit)
		}
		if (passwordEdit !== password) {
			updatedEntry.password = passwordEdit
			console.log("New password is: " + passwordEdit)
		}
		console.log(Object.keys(updatedEntry))
		if (Object.keys(updatedEntry).length > 0) {
			const jsonString = JSON.stringify(updatedEntry)
			updateFunc(id, jsonString)
			console.log("Update json is: " + jsonString)
		}
		setEditing(false)
		setUsernameEdit(username)
		setPlatformEdit(platform)
		setPasswordEdit(password)
	}

	return (
		<>
			{!editing ?
				<div style={containerStyle}>
					<div style={infoStyle}>{platform}</div>
					<div style={infoStyle}>{username}</div>
					<div style={infoStyle}>
						{isTop ? password : <Spoiler text={password} />}
					</div>
					{!isTop &&
						<div>
							<Button
								leftIcon={<MdDeleteOutline />}
								colorScheme="red"
								style={delButtonStyle}
								onClick={() => deleteFunc(id)}
							>Delete</Button>
							<Button
								leftIcon={<MdEdit />}
								colorScheme="blue"
								style={delButtonStyle}
								onClick={() => setEditing(true)}
							>Edit</Button>
						</div>
					}
				</div>
				:
				<div style={containerStyle}>
					<Input
						style={infoStyle}
						placeholder={platform}
						onChange={(e) => setPlatformEdit(e.target.value)}
						value={platformEdit} />
					<Input
						style={infoStyle}
						placeholder={username}
						onChange={(e) => setUsernameEdit(e.target.value)}
						value={usernameEdit} />
					<Input
						style={infoStyle}
						placeholder={password}
						onChange={(e) => setPasswordEdit(e.target.value)}
						value={passwordEdit} />
					{!isTop &&
						<div>
							<Button
								leftIcon={<MdCheck />}
								colorScheme="green"
								style={delButtonStyle}
								onClick={handleConfirmEdit}
							>Confirm</Button>
						</div>
					}
				</div>
			}
		</>
	)
};
export default PasswordCell;
const containerStyle = {
	display: 'grid',
	gridTemplateColumns: '1fr 1fr 1fr 1fr',
	alignItems: 'center',
	border: '1px solid #ccc',
	borderRadius: '10px',
	padding: '10px',
	margin: '10px 0',
	backgroundColor: '#f9f9f9'
};
const delButtonStyle = {
}
const infoStyle = {
	textAlign: 'left',
	padding: '0 10px',
};
