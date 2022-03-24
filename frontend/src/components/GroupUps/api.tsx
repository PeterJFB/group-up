import {fetchWithToken} from '../../api/api';
import {GroupObject, GroupUpObject} from '../../types/api';

export const changePlannedDate = async (groupUpId: number, newDate: string) => {
  const response = await fetchWithToken<GroupUpObject>(
    `/api/groupups/${groupUpId}/`,
    'PATCH',
    {plannedDate: newDate}
  );
  if (!response.missingToken && response.body)
    return {
      success: response.status == 204 || response.status == 200,
      plannedDate: response.body.plannedDate,
    };
  return {success: false};
};

export const getGroupUpAndGroupInfo = async (groupUpId: number) => {
  const response = await fetchWithToken<GroupUpObject>(
    `/api/groupups/${groupUpId}/`,
    'GET'
  );
  let groupUp: GroupUpObject;
  if (!response.missingToken && response.body) groupUp = response.body;
  else return;
  const group1 = await fetchWithToken<GroupObject>(
    `/api/groups/${groupUp?.group1}/`,
    'GET'
  );
  const group2 = await fetchWithToken<GroupObject>(
    `/api/groups/${groupUp?.group2}/`,
    'GET'
  );
  if (
    !group2.missingToken &&
    !group1.missingToken &&
    group1.body &&
    group2.body
  ) {
    return {groupUp: groupUp, group1: group1.body, group2: group2.body};
  }
};
