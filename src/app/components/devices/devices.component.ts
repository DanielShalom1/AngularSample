import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Device } from 'src/app/models/device';
import { DemoServerService } from 'src/app/services/demo-server/demo-server.service';
import { map, startWith } from 'rxjs/operators';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})


export class DevicesComponent implements OnInit {
  devicesInGroup: Device[];
  selectedGroupName: string;
  selectedGroup: number;
  groups: number[];
  devices: Device[];
  filteredDevices$: Observable<Device[]>;
  filter = new FormControl('');

  constructor(private server: DemoServerService) {
    this.groups = [];
  }

  ngOnInit(): void {
    this.getDevices();

    this.filteredDevices$ = this.filter.valueChanges.pipe(
      debounceTime(500),
      startWith(''),
      map(text => this._search(text))
    );

    this.devices.forEach(device => {
      if (!this.groups.includes(device.groupId) && device.groupId != null) {
        this.groups = [...this.groups, device.groupId];
      }
    });
  }

  getDevices(): void {
    this.server.getDevices().subscribe(devices => {
      this.devices = devices;
      devices.forEach(device => {
        if (!this.groups.includes(device.groupId) && device.groupId != null) {
          this.groups.push(device.groupId);
        }
      });
    });
  }

  changeStatus(device: Device): void{
    device.isActive = !device.isActive;
  }

  onGroupClick(group: number): void{
    this.selectedGroup = group;
    this.devicesInGroup = this.devices.filter(device => {
      return device.groupId === group;
    });
  }

  onRemoveDeviceFromGroupClick(device: Device): void{
    const index = this.devicesInGroup.indexOf(device, 0);
    if (index > -1) {
      this.devicesInGroup.splice(index, 1);
    }
  }

  onApplyBtnClick(): void{
    this.server.update(this.devicesInGroup, this.selectedGroup).subscribe( res => this.getDevices());
  }

  onClearBtnClick(): void{
    this.devicesInGroup = this.devices.filter(device => {
      return device.groupId === this.selectedGroup;
    });
  }

  onChangeCheck(isChecked: boolean, device: Device): void{
    if (isChecked){
      this.devicesInGroup.push(device);
      this.devicesInGroup.sort((a, b) => a.id - b.id);
    }
    else{
      const index = this.devicesInGroup.indexOf(device, 0);
      if (index > -1) {
        this.devicesInGroup.splice(index, 1);
      }
    }
  }

  getSelectedGroupName(): string {return !this.selectedGroup ? 'Select Group' : 'Group ' + this.selectedGroup; }

  trackByDeviceId(index: number, device: Device): number {
    return device.id;
  }

  trackByGroupId(index: number, group: number): number {
    return group;
  }

  _search(text: string): Device[] {
    return this.devices.filter(device => {
      const term = text.toLowerCase();
      return device.name.toLowerCase().includes(term);
    });
  }
}
