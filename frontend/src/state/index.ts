// Recoil states

import { atom } from 'recoil';

// Provides values to related components without rerendering the entire application
export type ReturnButtonState = [
  visible: boolean,
  onClick: React.MouseEventHandler<HTMLDivElement>
];

export const rbState = atom<ReturnButtonState>({
  key: 'ReturnButtonState',
  default: [
    false,
    () => {
      return;
    },
  ],
});

export const nState = atom<boolean>({
  key: 'NavigationState',
  default: true,
});

export enum AlertType {
  ERROR = 'ERROR',
  NOTIFY = 'NOTIFY',
}

export type AlertState = {
  type: AlertType;
  message: string;
  active: boolean;
};

export const alertState = atom<AlertState>({
  key: 'AlertState',
  default: {
    type: AlertType.ERROR,
    message: '',
    active: false,
  },
});

export type ConfettiState = {
  active: boolean
};

export const confettiState = atom<ConfettiState>({
  key: "ConfettiState",
  default: {
    active: true
  }
});

export type GoldState = {
  active: boolean
};


export const goldState = atom<GoldState>({
  key: "GoldState",
  default: {
    active: false
  }
});

export type CheckLoginState = {
  toggle: boolean
};


export const checkLoginState = atom<CheckLoginState>({
  key: "CheckLoginState",
  default: {
    toggle: false
  }
});