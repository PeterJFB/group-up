import {GroupObject, GroupUpObject} from '../../types/api';
import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {getGroupUpAndGroupInfo} from './api';
import GroupUpDetail from './GroupUpDetail';
import {Container} from '@chakra-ui/react';
const GroupUpPage: React.FC = () => {
  const [groupUp, setGroupUp] = useState<GroupUpObject>();
  const [group1, setGroup1] = useState<GroupObject>();
  const [group2, setGroup2] = useState<GroupObject>();
  const {id} = useParams();

  useEffect(() => {
    if (!id) return;
    getGroupUpAndGroupInfo(parseInt(id))
      .then(data => {
        if (data) {
          setGroupUp(data.groupUp);
          setGroup1(data.group1);
          setGroup2(data.group2);
        }
      })
      .catch(err => console.error(err));
  }, []);

  if (groupUp == undefined || group1 == undefined || group2 == undefined)
    return <Container>Loading...</Container>;

  return <GroupUpDetail group1={group1} group2={group2} groupUp={groupUp} />;
};
export default GroupUpPage;
