import React, { useState } from 'react';

const Spoiler = ({ text }) => {
	const [isHidden, setIsHidden] = useState(true);

	const handleClick = () => {
		setIsHidden(!isHidden);
	};

	const textStyle = {
		display: 'inline-block',
		padding: '10px',
		color: isHidden ? 'transparent' : 'black',
		backgroundColor: isHidden ? 'black' : 'transparent',
		cursor: 'pointer',
		border: '1px solid black',
		borderRadius: '5px',
	};

	return (
		<div onClick={handleClick} style={textStyle}>
			{text}
		</div>
	);
};

export default Spoiler;
