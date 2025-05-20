import { BaseDataRow } from "./CustomTable.interface";

export interface ApplicationData extends BaseDataRow {
  id: number;
  name: string;
  publsher: string;
  developer: string;
  isDownloadable: boolean;
  isShown: boolean;
  downloads: number;
}
