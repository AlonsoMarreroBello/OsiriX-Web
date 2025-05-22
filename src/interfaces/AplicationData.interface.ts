import { BaseDataRow } from "./CustomTable.interface";

export interface Publisher {
  publisherId: number;
  publisherName: string;
}

export interface Developer {
  developerId: number;
  name: string;
}

export interface ApplicationData extends BaseDataRow {
  id: number;
  name: string;
  publisher: Publisher;
  developer: Developer;
  isDownloadable: boolean;
  isVisible: boolean;
  isPublished: boolean;
  downloads: number;
}
