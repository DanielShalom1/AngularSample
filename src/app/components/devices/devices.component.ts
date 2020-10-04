import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { DeviceDbo } from 'src/app/models/deviceDbo';
import { DemoServerService } from 'src/app/services/demo-server/demo-server.service';
import { map, startWith } from 'rxjs/operators';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { Device } from 'src/app/models/device';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})


export class DevicesComponent implements OnInit {
  selectedGroupName: string;
  selectedGroup: number;
  groups: number[];
  devices: Device[];
  searchTerm = "";

  constructor(private server: DemoServerService) {
    this.groups = [];
  }

  ngOnInit(): void {
    this.getDevices();

    this.devices.forEach(device => {
      if (!this.groups.includes(device.groupId) && device.groupId != null) {
        this.groups = [...this.groups, device.groupId];
      }
    });
}

  getDevices(): void {
    this.devices = [];
    this.server.getDevices().subscribe(devices => {
      devices.forEach(deviceDbo => {
        const device = new Device(deviceDbo.id, deviceDbo.groupId, deviceDbo.name, deviceDbo.isActive);
        this.devices.push(device);
        if (!this.groups.includes(deviceDbo.groupId) && deviceDbo.groupId != null) {
          this.groups.push(deviceDbo.groupId);
        }
      });
    });
  }

  changeStatus(device: DeviceDbo): void{
    device.isActive = !device.isActive;
  }

  onGroupClick(group: number): void{
    this.selectedGroup = group;
    this.devices.forEach(device => {
      device.isChecked = device.groupId === group;
    });
  }

  onRemoveDeviceFromGroupClick(device: Device): void{
    device.isChecked = false;
  }

  onApplyBtnClick(): void{
    this.server.update(this.getCheckedDevices(), this.selectedGroup).subscribe( res => this.getDevices());
  }

  onClearBtnClick(): void{

  }

  getCheckedDevices(): Device[] {return this.devices.filter(device => device.isChecked); }

  getSelectedGroupName(): string {return !this.selectedGroup ? 'Select Group' : 'Group ' + this.selectedGroup; }

  trackByDeviceId(index: number, device: DeviceDbo): number {
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
