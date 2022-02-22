import React from 'react';
import './App.css';
import {Box} from '@chakra-ui/react';
import RegisterForm from './components/RegisterForm';
import {registerAndSaveToken} from './api/api';

function App() {
  return (
    <Box className="App">
      <RegisterForm onSubmit={registerAndSaveToken} />
    </Box>
  );
}

export default App;
