import React, { useState } from 'react';
import { host } from '../connection';
import { Heading, Button } from '@chakra-ui/react';
const TestConnection = () => {
  const [response, setResponse] = useState('');

  const testConnection = async () => {
    try {
	console.log(host+ '/')
      const res = await fetch(host + '/');
      const data = await res.json();
      setResponse(data.message);
    } catch (err) {
      setResponse('Failed to connect to the backend.');
    }
  };

  return (
    <div>
      <Heading as={'h2'} size={'xs'}>Test Backend Connection</Heading>
      <Button onClick={testConnection}>Test Connection</Button>
      {response && <p>Response: {response}</p>}
    </div>
  );
};

export default TestConnection;

