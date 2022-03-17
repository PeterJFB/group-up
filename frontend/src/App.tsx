import React from 'react';
import {Box, Flex} from '@chakra-ui/react';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import {LoginProvider} from './components/LoginProvider';
import {Groups} from './components/Groups';
import GroupProfile from './components/GroupProfile';
import Navigation from './components/Navigation';
import Header from './components/Header';
import {FindGroupUp} from './components/FindGroupUp';
import AlertModal from './components/AlertModal';

const Temp: React.FC = ({children}) => {
  return (
    <Box>
      Youre currently in:
      <Flex
        h={'80vh'}
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
          flex={1}
          height="100vh"
          direction={'column'}
          maxW={'container.md'}
          bgColor="groupWhite.100"
        >
          <Header />
          <Box overflowY={'auto'} flex={1}>
            <Routes>
              {/* <Route path="/" element={<Temp>Home</Temp>} /> */}
              <Route path="/groups" element={<Groups />} />
              <Route path="/groups/:id" element={<GroupProfile />} />
              <Route path="/findgroupup" element={<FindGroupUp />} />
              <Route path="/groupups" element={<Temp>gmatches</Temp>} />
              <Route path="/profile" element={<Temp>profile</Temp>} />
              <Route path="*" element={<Navigate to={'/groupups'} />} />
            </Routes>
          </Box>
          <Navigation />
          <AlertModal />
        </Flex>
      </LoginProvider>
    </BrowserRouter>
  );
}

export default App;
