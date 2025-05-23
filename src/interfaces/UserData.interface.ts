import { Role } from "../services/AuthService";
import { BaseDataRow } from "./CustomTable.interface";

export interface UserData extends BaseDataRow {
  id: number;
  username: string;
  email: string;
  userType: UserType;
  isEnabled: boolean;
  accountNotLocked: boolean;
  registerDate: string;
  lastLogin: string;
  publisherName?: string;
  nif?: string;
  address?: string;
  assignedStaff?: string;
  roles?: Role[];
}

export enum UserType {
  "user",
  "publisher",
  "staff",
}

export interface NewUserForm {
  id?: number;
  username: string;
  email: string;
  password?: string;
  isEnabled: boolean;
  userType: UserType;
  publisherName?: string;
  nif?: string;
  address?: string;
  assignedStaffId?: number;
  roleIds?: number[];
}

export interface UserRequestDto {
  username: string;
  email: string;
  password: string;
}

export interface staffRequestDto extends UserRequestDto {
  assgnedPublisherIds: number[];
  roleNames: string[];
}

export interface publisherRequestDto extends UserRequestDto {
  nif: string;
  publisherName: string;
  address: string;
  assignedAdminId: number | undefined;
}
