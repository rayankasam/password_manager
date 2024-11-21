import React, { useState } from "react";
import Spoiler from "./spoilerTag";
import { Button, Input } from "@chakra-ui/react";
import { MdEdit, MdDeleteOutline, MdCheck } from "react-icons/md";
interface PasswordCellProps {
	id: number,
	platform: string,
	username: string,
	password: string,
	updateFunc?: (id: number, jsonstring: string) => void,
	deleteFunc?: (id: number) => void,
	isTop?: boolean,
}
const PasswordCell = ({ id, platform, username, password, updateFunc, deleteFunc, isTop = false } :PasswordCellProps) => {
	const [editing, setEditing] = useState(false)
	const [platformEdit, setPlatformEdit] = useState(platform)
	const [usernameEdit, setUsernameEdit] = useState(username)
	const [passwordEdit, setPasswordEdit] = useState(password)
	const handleConfirmEdit = () => {
		const updatedEntry: { platform?: string; user?: string; password?: string } = {};
		if (platformEdit !== platform) {
			updatedEntry.platform = platformEdit
			console.log("New platform is: " + platformEdit)
		}
		if (usernameEdit !== username) {
			updatedEntry.user = usernameEdit
			console.log("New username is: " + usernameEdit)
		}
		if (passwordEdit !== password) {
			updatedEntry.password = passwordEdit
			console.log("New password is: " + passwordEdit)
		}
		if (Object.keys(updatedEntry).length > 0 && updateFunc) {
			const jsonString = JSON.stringify(updatedEntry)
			updateFunc(id, jsonString)
			console.log("Update json is: " + jsonString)
		}
		setEditing(false)
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
					{!isTop && deleteFunc &&
						<div>
							<Button
								leftIcon={<MdDeleteOutline />}
								colorScheme="red"
								onClick={() => deleteFunc(id)}
								style={{ marginRight: '10px' }}
							>Delete</Button>
							<Button
								leftIcon={<MdEdit />}
								colorScheme="blue"
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
const containerStyle: React.CSSProperties = {
	display: 'grid',
	gridTemplateColumns: '1fr 1fr 1fr 1fr',
	alignItems: 'center',
	border: '1px solid #ccc',
	borderRadius: '10px',
	padding: '10px',
	margin: '10px 0',
	backgroundColor: '#f9f9f9'
};
const infoStyle : React.CSSProperties= {
	textAlign: 'left',
	padding: '0 10px',
};
