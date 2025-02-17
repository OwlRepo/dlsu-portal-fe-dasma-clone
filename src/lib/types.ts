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
}

export type CustomField = {
  custom_field: {
    name: string;
  };
  [key: string]: unknown; // Allow additional properties with unknown type
};