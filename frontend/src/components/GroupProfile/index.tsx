import React, {useState, useEffect} from 'react';
import {Container} from '@chakra-ui/react';
import {useNavigate, useParams} from 'react-router-dom';
import {GroupObject} from '../../api/types';
import {ReturnButtonProps} from '../../App';
import GroupProfileDetail from './GroupProfileDetail';
import {fetchGroupAges, fetchGroupInfo} from './api';

const GroupProfile: React.FC<ReturnButtonProps> = ({showReturnButton}) => {
  const {id} = useParams();
  const [groupDetails, setGroupDetails] = useState<GroupObject>();
  const [ageDetails, setAgeDetails] = useState<string[]>();

  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      console.log(id);
      return;
    }
    fetchGroupInfo(parseInt(id))
      .then(resp => setGroupDetails(resp))
      .catch(err => console.log(err));
    fetchGroupAges(parseInt(id))
      .then(resp => setAgeDetails(resp))
      .catch(err => console.log(err));

    showReturnButton(true, () => {
      navigate('/groups');
      showReturnButton(false);
    });
  }, []);

  if (groupDetails == undefined || ageDetails == undefined)
    return <Container>Loading...</Container>;

  return <GroupProfileDetail group={groupDetails} birthdays={ageDetails} />;
};

export default GroupProfile;
