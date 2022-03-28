import React, {useEffect, useState} from 'react';
import {Box, Flex, Spinner} from '@chakra-ui/react';
import {Filter} from './Filter';
import {findGroupUp} from './api';
import {fetchWithToken} from '../../api/api';
import {ChosenGroup, GroupOption, GroupUpOption} from './GroupOption';
import {useSetRecoilState} from 'recoil';
import {rbState, nState} from '../../state';
import {useRerender} from '../../utils/hooks';
import {GroupObject} from '../../types/api';
import CenteredMessage from '../CenteredMessage';

export const FindGroupUp: React.FC = () => {
  const [chosenGroup, setChosenGroup] = useState<GroupObject>();
  const [groupOptions, setGroupOptions] = useState<GroupObject[]>();
  const setRbState = useSetRecoilState(rbState);
  const setNState = useSetRecoilState(nState);
  const [isLoading, setIsLoading] = useState(true);

  const [listener, rerender] = useRerender();

  /* Execute every time the chosen group changes */
  useEffect(() => {
    if (chosenGroup) {
      /* Hide navigation and show return button */
      setNState(false);
      setRbState([
        true,
        () => {
          setChosenGroup(undefined);
          setNState(true);
          setRbState([
            false,
            () => {
              return;
            },
          ]);
          setIsLoading(true);
        },
      ]);
    }

    if (!chosenGroup) {
      /* Retireve the users groups */
      fetchWithToken<GroupObject[]>('/api/groups/getMyGroups/', 'GET')
        .then(g => {
          if (g.missingToken === false) {
            setGroupOptions(g.body);
            setIsLoading(false);
          }
        })
        .catch(e => {
          console.error(e);
          setIsLoading(false);
        });
    }

    return () => {
      setNState(true);
      setRbState([
        false,
        () => {
          return;
        },
      ]);
    };
  }, [chosenGroup]);

  if (chosenGroup)
    return (
      <Flex direction={'column'} height="fit-content" minH="100%" width="100%">
        {/* Header */}
        <ChosenGroup group={chosenGroup} />
        <Filter
          onSubmit={async values => {
            setIsLoading(true);
            await findGroupUp(chosenGroup.id)(values)
              .then(({body}: {body: GroupObject[]}) => {
                setGroupOptions(body);
                setIsLoading(false);
              })
              .catch((e: unknown) => {
                console.error(e);
                setGroupOptions(undefined);
                setIsLoading(false);
              });
          }}
          listener={listener}
        />

        {/* Selection */}
        {isLoading && (
          <CenteredMessage>
            Finding potential GroupUps
            <Spinner />
          </CenteredMessage>
        )}
        {groupOptions && (
          <Box bgColor="groupWhite.100" overflowY="auto" flex={1}>
            {groupOptions.length > 0 ? (
              groupOptions.map(group => (
                <GroupUpOption
                  key={group.name}
                  group={group}
                  chosenGroup={chosenGroup}
                  refresh={rerender}
                />
              ))
            ) : (
              <CenteredMessage>No groups found</CenteredMessage>
            )}
          </Box>
        )}
        {!isLoading && !groupOptions && (
          <CenteredMessage>Fetching failed</CenteredMessage>
        )}
      </Flex>
    );

  return (
    <Flex direction={'column'} height="100%" width="100%">
      {/* Header */}
      <Flex justify="center" align="center" h="50px" bgColor={'groupWhite.200'}>
        Choose which group to GroupUp as:
      </Flex>

      {/* Selection */}
      {!isLoading && groupOptions && (
        <Box bgColor="groupWhite.100" overflowY="auto" flex={1}>
          {groupOptions.length > 0 ? (
            groupOptions.map(group => {
              return (
                <GroupOption
                  key={group.name}
                  group={group}
                  setChosenGroup={setChosenGroup}
                  setIsLoading={setIsLoading}
                />
              );
            })
          ) : (
            <CenteredMessage>
              You need to join a group before you can GroupUp
            </CenteredMessage>
          )}
        </Box>
      )}
      {!isLoading && !groupOptions && (
        <CenteredMessage>Fetching of groups failed</CenteredMessage>
      )}
    </Flex>
  );
};
