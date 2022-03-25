import {GroupUpObject} from '../../types/api';
import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {getGroupUp} from './api';
import GroupUpDetail from './GroupUpDetail';
import CenteredMessage from '../CenteredMessage';
import {useSetRecoilState} from 'recoil';
import {nState, rbState} from '../../state';
const GroupUpPage: React.FC = () => {
  const [groupUp, setGroupUp] = useState<GroupUpObject>();
  const {id} = useParams();
  const setRbState = useSetRecoilState(rbState);
  const setNState = useSetRecoilState(nState);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    getGroupUp(parseInt(id))
      .then(groupUp => {
        if (groupUp) {
          setGroupUp(groupUp);
        }

        setNState(false);
        setRbState([
          true,
          () => {
            navigate('/groupups');
            setNState(true);
            setRbState([
              false,
              () => {
                return;
              },
            ]);
          },
        ]);
      })
      .catch(err => console.error(err));
  }, []);

  if (groupUp == undefined)
    return <CenteredMessage>Loading...</CenteredMessage>;

  return <GroupUpDetail groupUp={groupUp} />;
};
export default GroupUpPage;
