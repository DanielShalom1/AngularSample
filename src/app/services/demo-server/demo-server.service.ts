import { DeviceDbo } from './../../models/deviceDbo';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

import { EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DemoServerService {
  private devices: DeviceDbo[] = [
    {id: 0, name: 'John', isActive: false, groupId: 1},
    {id: 1, name: 'Dan', isActive: true, groupId: 2},
    {id: 2, name: 'Yossi', isActive: false, groupId: 1},
    {id: 3, name: 'Eyal', isActive: true, groupId: 3},
    {id: 4, name: 'Moshe', isActive: false, groupId: 4},
    {id: 5, name: 'Nahum', isActive: true, groupId: 4},
    {id: 6, name: 'Yatrachna', isActive: false, groupId: 3},
  ];
  devices$ = new BehaviorSubject<DeviceDbo[]>(this.devices);

  constructor() { }

  update(devicesInGroup: DeviceDbo[], selectedGroup: number): void {
    devicesInGroup.forEach(device => {
      this.devices.find(o => o.id === device.id).groupId = selectedGroup;
    });

    this.devices.map(device => {
      if (device.groupId === selectedGroup && !devicesInGroup.find(o => o.id === device.id)){
        device.groupId = null;
      }
      return device;
    });
    this.devices$.next(this.devices);
  }
}
