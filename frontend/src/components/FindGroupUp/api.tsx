import {fetchWithToken} from '../../api/api';
import {GroupObject} from '../../api/types';
import {FilterProps} from './Filter';

export const findGroupUp =
  (groupId: number): FilterProps['onSubmit'] =>
  values => {
    // Parse the form to a set of queryparams, which the backend will use to filter on groups
    const id: number = groupId;
    const allParams: Record<string, string> = {};
    allParams['interests'] =
      values.interests?.reduce(
        (prev, interest) => (prev ? `${prev},${interest}` : interest),
        ''
      ) ?? '';
    allParams['location'] = values.location ?? '';
    allParams['date'] = values.meetingDate ?? '';
    allParams['ageMin'] = values.ageMin?.toString() ?? '';
    allParams['ageMax'] = values.ageMax?.toString() ?? '';

    // Only include params which has a value
    const params: Record<string, string> = {};
    for (const k in allParams) {
      if (allParams[k]) params[k] = allParams[k];
    }

    return fetchWithToken<GroupObject[]>(
      `/api/groups/${id}/findGroupUp/` +
        (params && Object.keys(params).length
          ? '?' + new URLSearchParams(params).toString()
          : ''),
      'GET'
    );
  };
