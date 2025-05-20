import { RequestType } from "../enum/RequestType.enum";
import { CategoryData } from "./Category.interface";
import { BaseDataRow } from "./CustomTable.interface";

interface RequestData extends BaseDataRow {
  id: number | null;
  user: number | undefined;
  requestDate?: string;
  requestStatus?: string;
  adminComments?: string;
  requestTitle?: string;
  requestBody?: string;
}

export interface FullRequestData extends RequestData {
  id: number | null;
  user: number | undefined;
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
}
