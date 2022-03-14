import React, {useEffect, useState} from 'react';
import {Box, Flex} from '@chakra-ui/react';
import {NavigationProps, ReturnButtonProps} from '../../App';
import {Filter} from './Filter';
import {findGroupUp} from './api';
import {fetchWithToken} from '../../api/api';
import {GroupObject} from '../../api/types';
import {ChosenGroup, GroupOption, GroupUpOption} from './GroupOption';

export const FindGroupUp: React.FC<ReturnButtonProps & NavigationProps> = ({
  showReturnButton,
  showNavigation,
}) => {
  const [chosenGroup, setChosenGroup] = useState<GroupObject>();
  const [groupOptions, setGroupOptions] = useState<GroupObject[]>();

  /* Execute every time the chosen group changes */
  useEffect(() => {
    if (chosenGroup) {
      /* Hide navigation and show return button */
      showNavigation(false);
      showReturnButton(true, () => {
        setChosenGroup(undefined);
        showReturnButton(false);
        showNavigation(true);
      });

      /* Retrieve the users potential groupups */
      fetchWithToken<GroupObject[]>(
        `/api/groups/${chosenGroup.id}/findGroupUp/`,
        'GET'
      ).then(g => {
        if (g.missingToken === false) {
          setGroupOptions(g.body);
        }
      });
    }

    if (!chosenGroup) {
      /* Retireve the users groups */
      fetchWithToken<GroupObject[]>('/api/groups/getMyGroups/', 'GET').then(
        g => {
          if (g.missingToken === false) {
            setGroupOptions(g.body);
          }
        }
      );
    }
  }, [chosenGroup]);

  if (groupOptions === undefined)
    return (
      <Flex
        direction={'column'}
        justify="center"
        align="center"
        height="100%"
        width="100%"
        textAlign={'center'}
        p="20px"
      >
        Fetching groups ...
      </Flex>
    );

  if (!chosenGroup && groupOptions.length === 0)
    return (
      <Flex
        direction={'column'}
        justify="center"
        align="center"
        height="100%"
        width="100%"
        textAlign={'center'}
        p="20px"
      >
        You need to join a group before you can GroupUp
      </Flex>
    );

  if (chosenGroup)
    return (
      <Flex direction={'column'} height="100%" width="100%">
        {/* Header */}
        <ChosenGroup group={chosenGroup} />
        <Filter
          onSubmit={values => {
            findGroupUp(chosenGroup.id)(values).then(
              ({body}: {body: GroupObject[]}) => {
                setGroupOptions(body);
              }
            );
          }}
          setGroupOptions={setGroupOptions}
        />

        {/* Selection */}
        <Box bgColor="groupWhite.100" overflowY="auto" flex={1}>
          {groupOptions &&
            groupOptions.length > 0 &&
            groupOptions.map(group => (
              <GroupUpOption
                key={group.name}
                group={group}
                setChosenGroup={setChosenGroup}
              />
            ))}
        </Box>
      </Flex>
    );

  return (
    <Flex direction={'column'} height="100%" width="100%">
      {/* Header */}
      <Flex justify="center" align="center" h="50px" bgColor={'groupWhite.200'}>
        Choose which group to GroupUp with:
      </Flex>

      {/* Selection */}
      <Box bgColor="groupWhite.100" overflowY="auto" flex={1}>
        {groupOptions.map(group => {
          return (
            <GroupOption
              key={group.name}
              group={group}
              setChosenGroup={setChosenGroup}
            />
          );
        })}
      </Box>
    </Flex>
  );
};
