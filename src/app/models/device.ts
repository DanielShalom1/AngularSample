import { Status } from './status';

export interface Device {
    id: number;
    groupId: number;
    name: string;
    status: Status;
}