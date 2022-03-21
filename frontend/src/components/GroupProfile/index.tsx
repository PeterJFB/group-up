import React, {useState, useEffect} from 'react';
import {Container} from '@chakra-ui/react';
import {useNavigate, useParams} from 'react-router-dom';
import {useSetRecoilState} from 'recoil';
import {nState, rbState} from '../../state';
import GroupProfileDetail from './GroupProfileDetail';
import {fetchGroupAges, fetchGroupInfo} from './api';
import {GroupObject} from '../../types/api';

const GroupProfile: React.FC = () => {
  const {id} = useParams();
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
        navigate('/groups');
        setNState(true);
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
    return <Container>Loading...</Container>;

  return <GroupProfileDetail group={groupDetails} birthdays={ageDetails} />;
};

export default GroupProfile;
