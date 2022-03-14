import React, {useRef} from 'react';
import {Box, Flex} from '@chakra-ui/react';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import {LoginProvider} from './components/LoginProvider';
import {Groups} from './components/Groups';
import GroupProfile from './components/GroupProfile';
import Navigation from './components/Navigation';
import Header from './components/Header';
import {FindGroupUp} from './components/FindGroupUp';

export type ReturnButtonProps = {
  showReturnButton: (
    visible: boolean,
    onClick?: React.MouseEventHandler<HTMLDivElement>
  ) => void;
};

export type NavigationProps = {
  showNavigation: (visible: boolean) => void;
};

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
  const rbRef = useRef<Header>(null);
  const nRef = useRef<Navigation>(null);

  const showReturnButton: ReturnButtonProps['showReturnButton'] = (
    visible,
    onClick
  ) => {
    if (onClick) {
      rbRef.current?.setState({onReturnButtonClick: onClick});
    }
    rbRef.current?.setState({showReturnButton: visible});
  };

  const showNavigation: NavigationProps['showNavigation'] = visible => {
    nRef.current?.setState({visible});
  };

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
          <Header ref={rbRef} />
          <Box overflowY={'auto'} flex={1}>
            <Routes>
              {/* <Route path="/" element={<Temp>Home</Temp>} /> */}
              <Route path="/groups" element={<Groups />} />
              <Route
                path="/groups/:id"
                element={<GroupProfile showReturnButton={showReturnButton} />}
              />
              <Route
                path="/findgroupup"
                element={
                  <FindGroupUp
                    showReturnButton={showReturnButton}
                    showNavigation={showNavigation}
                  />
                }
              />
              <Route path="/groupups" element={<Temp>gmatches</Temp>} />
              <Route path="/profile" element={<Temp>profile</Temp>} />
              <Route path="*" element={<Navigate to={'/groupups'} />} />
            </Routes>
          </Box>
          <Navigation ref={nRef} />
        </Flex>
      </LoginProvider>
    </BrowserRouter>
  );
}

export default App;
