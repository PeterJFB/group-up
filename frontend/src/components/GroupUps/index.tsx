import React, {useEffect, useState} from 'react';
import {GroupUpListItem} from './GroupUpListItem';
import {GroupUpObject} from '../../types/api';
import {getGroupUps} from './api';
import {useSetRecoilState} from 'recoil';
import {alertState, AlertType} from '../../state';
import CenteredMessage from '../CenteredMessage';
import {Image, Spinner} from '@chakra-ui/react';

export const GroupUps: React.FC = () => {
  const [groupUps, setGroupUps] = useState<GroupUpObject[] | undefined>(
    undefined
  );
  const setAlertState = useSetRecoilState(alertState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getGroupUps()
      .then(groupUps => {
        if (groupUps) {
          setGroupUps(groupUps);
        } else {
          setAlertState({
            type: AlertType.ERROR,
            message:
              'An error occured while attempting to get your GroupUps. Please try again later',
            active: true,
          });
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      {!isLoading ? (
        <>
          {groupUps &&
            groupUps.length > 0 &&
            groupUps.map((groupUp, id) => {
              id++;
              return <GroupUpListItem key={id} groupUp={groupUp} />;
            })}
          {groupUps && groupUps.length === 0 && (
            <CenteredMessage>
              You have no GroupUps yet. Go to{' '}
              <Image
                src={`${process.env.PUBLIC_URL}/navicons/search.svg`}
                maxH="20px"
                display={'inline-flex'}
              />{' '}
              to find your groups first GroupUp
            </CenteredMessage>
          )}
        </>
      ) : (
        <CenteredMessage>
          <Spinner />
        </CenteredMessage>
      )}
    </>
  );
};
