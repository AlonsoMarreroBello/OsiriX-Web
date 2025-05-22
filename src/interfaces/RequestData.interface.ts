import { RequestType } from "../enum/RequestType.enum";
import { Developer } from "./AplicationData.interface";
import { CategoryData } from "./Category.interface";
import { BaseDataRow } from "./CustomTable.interface";
import { UserData } from "./UserData.interface";

interface RequestData extends BaseDataRow {
  id: number | null;
  user: UserData;
  requestDate?: string;
  requestStatus?: string;
  adminComments?: string;
  requestTitle?: string;
  requestBody?: string;
}

export interface Application {
  appId: number;
  name: string;
  description: string;
  isDownloadable: boolean;
  isVisible: boolean;
  categories: CategoryData[];
  developer: Developer;
}

export interface FullRequestData extends RequestData {
  id: number | null;
  user: UserData;
  requestDate?: string;
  requestStatus?: string;
  adminComments?: string;
  appTitle?: string;
  appDescription?: string;
  publishApp?: boolean;
  downloadableNow?: boolean;
  appZipFile?: File;
  appIconFile?: File;
  appImageFile?: File;
  selectedCategories?: CategoryData[];
  selectedDeveloperId?: number;
  requestType: RequestType;
  app?: Application | undefined;
}
