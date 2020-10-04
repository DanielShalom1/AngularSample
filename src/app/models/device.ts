
export class Device {
    id: number;
    groupId: number;
    name: string;
    isActive: boolean;
    isChecked: boolean;

    constructor(id: number, groupId: number, name: string, isActive: boolean) {
        this.id = id;
        this.groupId = groupId;
        this.name = name;
        this.isActive = isActive;
        this.isChecked = false;
      }
}
