import { DeviceDbo } from './../../models/deviceDbo';
import { DemoServerService } from 'src/app/services/demo-server/demo-server.service';
import { Device } from './../../models/device';
import { debounceTime } from 'rxjs/internal/operators';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})


export class DevicesComponent implements OnInit, AfterViewInit {
  @ViewChild('filterInput') filterInput: ElementRef;
  selectedGroupName: string;
  selectedGroup: number;
  groups: number[];
  devices: Device[];
  filteredDevices: Device[];

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
    this.filteredDevices = [...this.devices];
  }

  ngAfterViewInit(): void {
    fromEvent<any>(this.filterInput.nativeElement, 'keyup').pipe(debounceTime(500)).subscribe(() =>
        this.filteredDevices = this._search(this.filterInput.nativeElement.value)
      );
  }

  getDevices(): void {
    this.devices = [];
    this.groups = [];
    this.server.getDevices().subscribe(devices => {
      devices.forEach(deviceDbo => {
        const device = new Device(deviceDbo.id, deviceDbo.groupId, deviceDbo.name, deviceDbo.isActive);
        this.devices.push(device);
        if (!this.groups.includes(deviceDbo.groupId) && deviceDbo.groupId != null) {
          this.groups.push(deviceDbo.groupId);
        }
      });
    });
    this.groups.sort();
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
    this.server.update(this.getCheckedDevices(), this.selectedGroup).subscribe( () => this.getDevices());
    this.filteredDevices = this._search(this.filterInput.nativeElement.value);
    this.devices.forEach(device =>{
      if (device.groupId === this.selectedGroup) {
        device.isChecked = true;
      }
      else{
        device.isChecked = false;
      }
    });
  }

  onClearBtnClick(): void{
    this.devices.forEach(device =>{
      if (device.groupId === this.selectedGroup) {
        device.isChecked = true;
      }
      else{
        device.isChecked = false;
      }
    });
  }

  getCheckedDevices(): Device[] {return this.devices.filter(device => device.isChecked); }

  getSelectedGroupName(): string {return !this.selectedGroup ? 'Select Group' : 'Group ' + this.selectedGroup; }

  trackByDeviceId(device: DeviceDbo): number {
    return device.id;
  }

  trackByGroupId(group: number): number {
    return group;
  }

  _search(text: string): Device[] {
    return this.devices.filter(device => {
      const term = text.toLowerCase();
      return device.name.toLowerCase().includes(term);
    });
  }
}
