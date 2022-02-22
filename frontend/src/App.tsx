import React from 'react';
import './App.css';
import {Box, Flex} from '@chakra-ui/react';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import {LoginProvider} from './components/LoginProvider';
import {Navigation} from './components/Navigation';

const Temp: React.FC = ({children}) => {
  return (
    <Box>
      Youre currently in:
      <Flex
        h={900}
        bg={'twitter.300'}
        justifyContent="center"
        alignItems={'center'}
      >
        <Box as="span" textAlign={'center'} fontWeight={'extrabold'}>
          {children}
        </Box>
      </Flex>
      Youve reached the bottom
    </Box>
  );
};

function App() {
  return (
    <BrowserRouter>
      <LoginProvider>
        <Flex
          direction={'column'}
          maxH={'100vh'}
          h={'100vh'}
          maxW={'container.md'}
          overflow={'hidden'}
        >
          <Box overflowX={'scroll'} flex={1}>
            <Routes>
              {/* <Route path="/" element={<Temp>Home</Temp>} /> */}
              <Route path="/groups" element={<Temp>groups</Temp>} />
              <Route path="/find" element={<Temp>find</Temp>} />
              <Route path="/gmatches" element={<Temp>gmatches</Temp>} />
              <Route path="/profile" element={<Temp>profile</Temp>} />
              <Route path="*" element={<Navigate to={'/gmatches'} />} />
            </Routes>
          </Box>
          <Navigation />
        </Flex>
      </LoginProvider>
    </BrowserRouter>
  );
}

export default App;
