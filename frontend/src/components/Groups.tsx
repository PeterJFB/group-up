import React, {useEffect, useState} from 'react';
import {
  Modal,
  Circle,
  useDisclosure,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import {AddIcon} from '@chakra-ui/icons';
import CreateGroupForm from './CreateGroupForm';
import {CreateGroupObject} from './types';
import {fetchWithToken} from '../api/api';
import {GroupObject} from '../api/types';
import {GroupListItem} from './GroupListItem';

export const Groups: React.FC = () => {
  //TODO: Replace mockgroups array with actual group data from API
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [groups, setGroups] = useState<GroupObject[]>([]);
  const [refresh, toggleRefresh] = useState(false);
  useEffect(() => {
    fetchWithToken<GroupObject[]>('/api/groups/getMyGroups/', 'GET').then(
      res => {
        console.log(res);
        if (!res.missingToken && res.body !== undefined) setGroups(res.body);
      }
    );
  }, [refresh]);
  // const mockGroups = [
  //   {
  //     id: 0,
  //     name: 'De kule kidsa',
  //     members: ['test', 'test2', 'test3', 'test4'],
  //     interests: ['Skape trøbbel', 'Røyke ostepop'],
  //   },
  //   {
  //     id: 1,
  //     name: 'Bowlerne',
  //     members: ['test', 'test2'],
  //     interests: ['Wii Sports', 'Wii Sports Resort'],
  //   },
  //   {
  //     id: 2,
  //     name: 'Gutta Krutt',
  //     members: ['Bob', 'Kåre', 'Ole'],
  //     interests: ['Fisking', 'Pils', 'Rosenborg'],
  //   },
  // ];

  const onSubmit = (values: CreateGroupObject) => {
    onClose();
    const interestArr = values.interests.split(',').map(interest => ({
      name: interest,
      description: 'beskrivelse',
    }));
    const body = {
      name: values.name,
      quote: values.quote,
      description: values.description,
      interests: interestArr,
      location: values.location,
      date: values.date,
    };
    fetchWithToken('/api/groups/', 'POST', body).then(response => {
      toggleRefresh(!refresh);
      console.log(response);
    });
  };

  return (
    <>
      {groups.map(group => {
        return (
          <GroupListItem
            key={group.name}
            to={`/groups/${group.id}`}
            group={group}
          />
        );
      })}
      <Circle
        bgColor="groupGreen"
        size="80px"
        onClick={onOpen}
        justifyContent={'center'}
        alignContent={'center'}
        position={'fixed'}
        bottom={'100px'}
        right={'20px'}
      >
        <AddIcon color={'white'} w={'60px'} h={'60px'} />
      </Circle>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Register Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CreateGroupForm onSubmit={onSubmit} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
