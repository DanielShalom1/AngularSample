import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Device } from 'src/app/models/device';
import { Status } from 'src/app/models/status';
import { EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DemoServerService {

  private devices: Device[] = [
    {id: 0, name: 'John', status: Status.inactive, groupId: 1},
    {id: 1, name: 'Dan', status: Status.inactive, groupId: 2},
    {id: 2, name: 'Yossi', status: Status.inactive, groupId: 1},
    {id: 3, name: 'Eyal', status: Status.inactive, groupId: 3},
    {id: 4, name: 'Moshe', status: Status.inactive, groupId: 4},
    {id: 5, name: 'Nahum', status: Status.inactive, groupId: 4},
    {id: 6, name: 'Yatrachna', status: Status.inactive, groupId: 3},
  ];

  constructor() { }

  getDevices(): Observable<Device[]>{
    return of(this.devices);
  }
  update(devicesInGroup: Device[], selectedGroup: number): Observable<any> {
    devicesInGroup.forEach(device => {
      this.devices.find(o => o.id === device.id).groupId = selectedGroup;
    });

    this.devices.forEach(device => {
      if (device.groupId === selectedGroup && !devicesInGroup.find(o => o.id === device.id)){
        device.groupId = null;
      }
    });
    return EMPTY;
  }

}
