import React, {useState, useEffect} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {useSetRecoilState} from 'recoil';
import {nState, rbState} from '../../state';
import GroupProfileDetail from './GroupProfileDetail';
import {fetchGroupAges, fetchGroupInfo} from './api';
import {GroupObject} from '../../types/api';
import CenteredMessage from '../CenteredMessage';

const GroupProfile: React.FC = () => {
  function useQuery() {
    const {search} = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

  const {id} = useParams();
  const query = useQuery();
  const redirect = query.get('redirect');
  const redirectNState = query.get('redirectNState');
  const [groupDetails, setGroupDetails] = useState<GroupObject>();
  const [ageDetails, setAgeDetails] = useState<string[]>();
  const navigate = useNavigate();
  const setRbState = useSetRecoilState(rbState);
  const setNState = useSetRecoilState(nState);

  useEffect(() => {
    if (!id) {
      return;
    }
    fetchGroupInfo(parseInt(id))
      .then(resp => setGroupDetails(resp))
      .catch(err => console.error(err));
    fetchGroupAges(parseInt(id))
      .then(resp => setAgeDetails(resp))
      .catch(err => console.error(err));

    setNState(false);
    setRbState([
      true,
      () => {
        navigate(redirect ? redirect : '/groups');
        setNState(
          redirectNState == undefined ? true : redirectNState === 'true'
        );
        setRbState([
          false,
          () => {
            return;
          },
        ]);
      },
    ]);
  }, []);

  if (groupDetails == undefined || ageDetails == undefined)
    return <CenteredMessage>Loading</CenteredMessage>;

  return <GroupProfileDetail group={groupDetails} birthdays={ageDetails} />;
};

export default GroupProfile;
