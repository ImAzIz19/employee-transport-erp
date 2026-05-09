import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dataChanged = new Subject<'delete' | 'deactivate' | 'activate' | 'add' | 'update'>();
  dataChanged$ = this.dataChanged.asObservable();
  private lastAction: 'delete' | 'deactivate' | 'activate' | 'add' | 'update' | null = null;

  notifyDataChanged(action: 'delete' | 'deactivate' | 'activate' | 'add' | 'update'): void {
    console.log('Notifying with action:', action);
    this.lastAction = action; // Store the last action
    this.dataChanged.next(action);
  }

  getLastAction(): 'delete' | 'deactivate' | 'activate' | 'add' | 'update' | null {
    return this.lastAction;
  }

  clearLastAction(): void {
    this.lastAction = null;
  }
}