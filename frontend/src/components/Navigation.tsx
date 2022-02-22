import {Flex, Image, Link} from '@chakra-ui/react';
import React from 'react';
import {Link as ReactLink, useLocation} from 'react-router-dom';

type NavItemProps = {
  image: string;
  to: string;
  selected?: boolean;
};

const NavItem: React.FC<NavItemProps> = ({image, to}) => {
  const location = useLocation();
  const iconSize = '74px';
  const selected = location.pathname.startsWith(to);
  return (
    <Link as={ReactLink} to={to} _focus={{outline: 'none'}}>
      <Flex
        justifyContent={'center'}
        alignItems={'center'}
        maxW={iconSize}
        maxH={iconSize}
        minW={iconSize}
        minH={iconSize}
      >
        <Image
          objectFit={'cover'}
          src={image}
          opacity={selected ? '100%' : '20%'}
        />
      </Flex>
    </Link>
  );
};

export const Navigation: React.FC = () => {
  return (
    <Flex
      boxShadow="0px 0px 20px rgba(0, 0, 0, 20%)"
      zIndex={200}
      maxW="container.md"
      width={'100%'}
      bottom={0}
      justifyContent="space-evenly"
      bgColor="#f2f2f2"
    >
      <NavItem
        image={`${process.env.PUBLIC_URL}/navicons/groups.svg`}
        to="/groups"
      />
      <NavItem
        image={`${process.env.PUBLIC_URL}/navicons/search.svg`}
        to="/find"
      />
      <NavItem
        image={`${process.env.PUBLIC_URL}/navicons/groupup.svg`}
        to="/gmatches"
      />
      <NavItem
        image={`${process.env.PUBLIC_URL}/navicons/profile.svg`}
        to="/profile"
      />
    </Flex>
  );
};
