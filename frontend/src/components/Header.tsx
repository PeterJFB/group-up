import {Box, Flex, Image, Link} from '@chakra-ui/react';
import {Link as ReactLink} from 'react-router-dom';
import React from 'react';
import {ChevronLeftIcon} from '@chakra-ui/icons';

type Props = {
  showReturnButton: boolean;
  onReturnButtonClick: React.MouseEventHandler<HTMLDivElement>;
};

export const Header: React.FC<Props> = ({
  showReturnButton,
  onReturnButtonClick,
}) => {
  return (
    <Flex
      h={'60px'}
      bg={'groupGreen'}
      maxW={'container.md'}
      justifyContent="center"
      alignItems={'center'}
    >
      {showReturnButton && (
        <Box position="absolute" left={0} onClick={onReturnButtonClick}>
          <ChevronLeftIcon w={10} h={10} color={'groupWhite.200'} />
        </Box>
      )}
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
