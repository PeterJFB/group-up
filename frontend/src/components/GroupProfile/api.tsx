import {fetchWithToken} from '../../api/api';
import {GroupObject} from '../../types/api';

export async function fetchGroupInfo(id: number) {
  const response = await fetchWithToken<GroupObject>(
    `/api/groups/${id}/`,
    'GET'
  );
  if (!response.missingToken) return response.body;
  else return;
}

export async function fetchGroupAges(id: number) {
  const response = await fetchWithToken<string[]>(
    `/api/groups/${id}/getAges/`,
    'GET'
  );
  if (!response.missingToken) return response.body;
  else return;
}

export function findAndSortAges(birthdays: string[]) {
  const listAge = birthdays.map(age => {
    return new Date().getFullYear() - new Date(age).getFullYear();
  });
  const listAgeSorted = listAge.sort((n1, n2) => n1 - n2);
  return listAgeSorted;
}

export function generateAgeGapText(birthdays: string[]) {
  const agesSorted = findAndSortAges(birthdays);
  if (birthdays[0] == birthdays[birthdays.length - 1]) {
    return agesSorted[0] + ' y.o.';
  } else {
    return (
      agesSorted[0] + ' y.o. - ' + agesSorted[agesSorted.length - 1] + ' y.o.'
    );
  }
}
