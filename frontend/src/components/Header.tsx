import {Box, Flex, Image, Link} from '@chakra-ui/react';
import {Link as ReactLink} from 'react-router-dom';
import React from 'react';
import {ChevronLeftIcon} from '@chakra-ui/icons';
import {useRecoilValue} from 'recoil';
import {rbState} from '../state';

const Header: React.FC = () => {
  const [visible, onClick] = useRecoilValue(rbState);
  const ReturnButton = () => (
    <Box
      role="returnButton"
      position="absolute"
      left={0}
      onClick={e => {
        onClick(e);
      }}
      _hover={{cursor: 'pointer'}}
    >
      <ChevronLeftIcon w={10} h={10} color={'groupWhite.200'} />
    </Box>
  );
  return (
    <Flex
      h={'60px'}
      bg={'groupGreen'}
      maxW={'container.md'}
      justifyContent="center"
      alignItems={'center'}
    >
      {visible && <ReturnButton />}
      <Link as={ReactLink} to="/" height="100%" _focus={{outline: 'none'}}>
        <Image
          src={`${process.env.PUBLIC_URL}/logo.svg`}
          objectFit={'contain'}
          maxHeight="100%"
          minHeight="100%"
        />
      </Link>
    </Flex>
  );
};

export default Header;
