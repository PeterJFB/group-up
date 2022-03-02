import React, {useState} from 'react';
import {Box, Flex} from '@chakra-ui/react';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import {LoginProvider} from './components/LoginProvider';
import {Navigation} from './components/Navigation';
import {Header} from './components/Header';
import {Groups} from './components/Groups';
import GroupProfile from './components/GroupProfile';

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showReturnButton, setShowReturnButton] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [onReturnButtonClick, setOnReturnButtonClick] = useState<
    React.MouseEventHandler<HTMLDivElement>
  >(() => {
    return;
  });
  return (
    <BrowserRouter>
      <LoginProvider>
        <Flex
          flex={1}
          height="100vh"
          direction={'column'}
          maxW={'container.md'}
        >
          <Header
            showReturnButton={showReturnButton}
            onReturnButtonClick={onReturnButtonClick}
          />
          <Box overflowX={'scroll'} flex={1}>
            <Routes>
              {/* <Route path="/" element={<Temp>Home</Temp>} /> */}
              <Route path="/groups" element={<Groups />} />
              <Route path="/groups/:id" element={<GroupProfile />} />
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
