import {useState} from 'react';

export const useRerender = (): [boolean, () => void] => {
  const [listener, setState] = useState(false);

  const rerender = () => {
    setState(!listener);
  };
  return [listener, rerender];
};
