import { useState } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';

function ChangeName() {
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('');

  const authToken = sessionStorage.getItem('authToken');

  const handleChangeName = async () => {
    setErrorMessage('');
    setLoadingMessage('Please wait...');

    if (!name) {
      setErrorMessage('Name must be filled in');
      setLoadingMessage('');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/change-name`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authToken,
          name,
        }),
      });

      if (response.ok) {
        setLoadingMessage('');
        setSuccessMessage('Name has been changed.');
      } else {
        const errorData = await response.json();
        setLoadingMessage('');
        setErrorMessage(errorData.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Box
      style={{
        backgroundColor: 'white',
        padding: '1em',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h4">Change Name</Typography>
      {loadingMessage && (
        <Typography style={{ color: 'green', margin: '1em 0' }}>
          {loadingMessage}
        </Typography>
      )}
      {successMessage && (
        <Typography style={{ color: 'green', margin: '1em 0' }}>
          {successMessage}
        </Typography>
      )}
      {errorMessage && (
        <Typography style={{ color: 'red', margin: '1em 0' }}>
          {errorMessage}
        </Typography>
      )}
      {successMessage === '' ? (
        <>
          <TextField
            label="New Name"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleChangeName}
            style={{ margin: '1em 0' }}
          >
            Change Name
          </Button>
        </>
      ) : null}
    </Box>
  );
}

export default ChangeName;
