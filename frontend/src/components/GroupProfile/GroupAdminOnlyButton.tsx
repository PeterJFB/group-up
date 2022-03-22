import {Button} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
import {getStoredUser} from './api';

export const GroupAdminOnlyButton: React.FC<{
  groupAdmin: number;
  buttonText: string;
  onClick: () => void;
}> = ({groupAdmin, onClick, buttonText}) => {
  const [hidden, setHidden] = useState(true);
  useEffect(() => {
    const user = getStoredUser();
    if (user && groupAdmin == user.id) setHidden(false);
    else setHidden(true);
  }, [groupAdmin]);
  return (
    <Button
      bg="groupGreen"
      textColor="groupWhite.200"
      mt="10"
      onClick={onClick}
      hidden={hidden}
    >
      {buttonText}
    </Button>
  );
};
