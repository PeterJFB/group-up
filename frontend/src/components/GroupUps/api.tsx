import {fetchWithToken} from '../../api/api';
import {GroupUpObject} from '../../types/api';

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

export const getGroupUp = async (groupUpId: number) => {
  const response = await fetchWithToken<GroupUpObject>(
    `/api/groupups/${groupUpId}/`,
    'GET'
  );
  if (!response.missingToken && response.body) return response.body;
};

export const getGroupUps = async () => {
  const response = await fetchWithToken<GroupUpObject[]>(
    '/api/groupups/getGroupUps/',
    'GET'
  );

  if (!response.missingToken && response.body) return response.body;

  console.error('Fetching of GroupUps failed');
};
