import {Box, Flex, Image, Link} from '@chakra-ui/react';
import {Link as ReactLink} from 'react-router-dom';
import React, {RefObject} from 'react';
import {ChevronLeftIcon} from '@chakra-ui/icons';

type Props = {ref: RefObject<Header>};

type State = {
  showReturnButton: boolean;
  onReturnButtonClick: React.MouseEventHandler<HTMLDivElement>;
};

// Using class component as it will be handled with useRef
class Header extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showReturnButton: false,
      onReturnButtonClick: () => {
        return;
      },
    };
  }

  ReturnButton = () => (
    <Box
      position="absolute"
      left={0}
      onClick={e => {
        this.state?.onReturnButtonClick(e);
      }}
      _hover={{cursor: 'pointer'}}
    >
      <ChevronLeftIcon w={10} h={10} color={'groupWhite.200'} />
    </Box>
  );
  render() {
    const {showReturnButton} = this.state;
    return (
      <Flex
        h={'60px'}
        bg={'groupGreen'}
        maxW={'container.md'}
        justifyContent="center"
        alignItems={'center'}
      >
        {showReturnButton && <this.ReturnButton />}
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
  }
}

export default Header;
