export interface AlarmModel {
  alarms: Alarm[];
  self: string;
  statistics: Statistics
}

export interface Alarm {
  connectorId: string;
  count: number
  creationTime: string;
  firstOccurrenceTime: string;
  history: History;
  id: string;
  self: string;
  severity: string;
  source: Source;
  status: string;
  text: string;
  time: string;
  type: string;
}

interface History {
  auditRecords: any[];
  self: string;
}

interface Source {
  id: string;
  name: string;
  self: string;
}

export interface Statistics {
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

export enum SeverityEnum {
  CRITICAL,
  MAJOR,
  MINOR,
  WARNING
}
