import { DemoServerService } from './../../services/demo-server/demo-server.service';
import { DeviceDbo } from './../../models/deviceDbo';
import { Device } from './../../models/device';
import { debounceTime, takeUntil } from 'rxjs/internal/operators';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { combineLatest, fromEvent, Subject } from 'rxjs';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})


export class DevicesComponent implements OnInit, OnDestroy, AfterViewInit {
  private unsubscribe$ = new Subject<void>();
  @ViewChild('filterInput') filterInput: ElementRef;
  selectedGroup: number;
  groups: number[] = [];
  devices: Device[] = [];
  filteredDevices: Device[] = [];

  constructor(private server: DemoServerService) {
  }

  ngOnInit(): void {
    this.server.devices$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(devicesDbo => {
      this.devices = [];
      this.groups = [];
      devicesDbo.forEach(deviceDbo => {
        const device: Device =
        {
           id: deviceDbo.id, groupId: deviceDbo.groupId, name: deviceDbo.name, isActive: deviceDbo.isActive, isChecked: false
        };
        this.devices.push(device);
        if (!this.groups.includes(deviceDbo.groupId) && deviceDbo.groupId != null) {
          this.groups.push(deviceDbo.groupId);
        }
      });
      this.groups.sort();
      this.filteredDevices = [...this.devices];
    });
  }

  ngAfterViewInit(): void {
    const events = [];
    events.push(fromEvent<any>(this.filterInput.nativeElement, 'keyup').pipe(debounceTime(300)));
    events.push(this.server.devices$.pipe(takeUntil(this.unsubscribe$)));
    combineLatest(events).subscribe(([, devices]: any[]) => {
      this.devices = [];
      this.groups = [];
      devices.forEach(deviceDbo => {
        const device: Device =
        {
           id: deviceDbo.id, groupId: deviceDbo.groupId, name: deviceDbo.name, isActive: deviceDbo.isActive, isChecked: false
        };
        this.devices.push(device);
        if (!this.groups.includes(deviceDbo.groupId) && deviceDbo.groupId != null) {
          this.groups.push(deviceDbo.groupId);
        }
      });
      this.groups.sort();
      this.filteredDevices = this._search(this.filterInput.nativeElement.value, this.devices);
    });
  }

  changeStatus(device: Device): void{
    device.isActive = !device.isActive;
  }

  onGroupClick(group: number): void{
    this.selectedGroup = group;
    this.devices.map(device => device.isChecked = device.groupId === group);
  }

  onRemoveDeviceFromGroupClick(device: Device): void{
    device.isChecked = false;
  }

  onApplyBtnClick(): void{
    this.server.update(this.getCheckedDevices(), this.selectedGroup);
    this.filteredDevices = this._search(this.filterInput.nativeElement.value, this.devices);
    this.devices.map(device => device.isChecked = device.groupId === this.selectedGroup);
  }

  onClearBtnClick(): void{
    this.devices.map(device => device.isChecked = device.groupId === this.selectedGroup);
  }

  getCheckedDevices(): Device[] {return this.devices.filter(device => device.isChecked); }

  getSelectedGroupName(): string {return !this.selectedGroup ? 'Select Group' : 'Group ' + this.selectedGroup; }

  trackByDeviceId(device: DeviceDbo): number {
    return device.id;
  }

  trackByGroupId(group: number): number {
    return group;
  }

  _search(text: string, devices: Device[]): Device[] {
    return devices.filter(device => {
      const term = text.toLowerCase();
      return device.name.toLowerCase().includes(term);
    });
  }
  ngOnDestroy(): void{
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
