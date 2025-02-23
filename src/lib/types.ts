export interface UserProps {
  user_id: string;
  name: string;
  photo_exist: boolean;
}

export interface DeviceProps {
  id: string;
  name: string;
}

export interface ScanProps {
  user: UserProps;
  device: DeviceProps;
  datetime: string;
  remarks?: string | null | undefined;
  livedName: string | null | undefined;
  userImage?: string;
  disabled?: string
  expiryDate?: string
}

export type CustomField = {
  custom_field: {
    name: string;
  };
  [key: string]: unknown; // Allow additional properties with unknown type
};

export interface TurnstileGridProps {
  scanDetails: ScanProps[];
  setScanDetail: (scanDetail: ScanProps) => void;
  turnstileCount: number;
}

export const BORDER_CLASSES = {
  ERROR: 'border-4 border-red-500',
  WARNING: 'border-4 border-yellow-500',
  SUCCESS: 'border-4 border-green-500',
  DEFAULT: ''
} as const;

export type BorderColorClass = typeof BORDER_CLASSES[keyof typeof BORDER_CLASSES];

export interface ScanDetailStatus {
  expiryDate?: string;
  disabled?: string;
  remarks?: string | null; // Updated to allow null
  userImage?: string;
  user: {
    name: string;
    user_id: string;
  };
  device: {
    id: string;
  };
  livedName?: string | null | undefined; 
}