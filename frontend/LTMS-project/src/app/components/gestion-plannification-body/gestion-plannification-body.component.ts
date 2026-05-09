import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GestionPlannificationDataComponent } from "../gestion-plannification-data/gestion-plannification-data.component";
import { Observable, catchError, finalize, of, forkJoin } from 'rxjs';
import { Path } from '../../interface/circuit/circuit';
import { ShiftDTO } from '../../interface/shift/shift';
import { Agency } from '../../interface/agency/agency';
import { CircuitService } from '../../services/circuit/circuit.service';
import { ShiftService } from '../../services/shift/shift-service.service';
import { AgencyService } from '../../services/agency/agency.service';
import { BusPlanRequestDTO } from '../../interface/busPlanDTO/busPlanRequestDTO';
import { BusPlanDTO } from '../../interface/busPlanDTO/busPlanDTO';
import { BusPlanificationService } from '../../services/busPlanification/bus-planification.service';
import { parseServerErrorMessage } from '../../utils/handleError'; // Assuming this utility exists

@Component({
  selector: 'app-gestion-plannification-body',
  templateUrl: './gestion-plannification-body.component.html',
  styleUrls: ['./gestion-plannification-body.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    GestionPlannificationDataComponent,
  ],
  providers: [ShiftService, CircuitService, AgencyService, BusPlanificationService]
})
export class GestionPlannificationBodyComponent implements OnInit {
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading: boolean = false;
  agencyId: number | null = null;
  week: string | null = null;
  operationType: 'load' | 'recalculate' = 'load';
  allAgencies: boolean = true;

  weeks: number[] = Array.from({ length: 52 }, (_, i) => i + 1);
  currentDate = new Date();
  currentWeek = this.getWeekNumber(this.currentDate);
  currentYear = this.currentDate.getFullYear();

  availableDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  selectedDays: string[] = [];
  showDayDropdown = false;

  availableShifts: ShiftDTO[] = [];
  selectedShifts: ShiftDTO[] = [];
  showShiftDropdown = false;

  availableCircuits: Path[] = [];
  selectedCircuits: string[] = [];
  showCircuitDropdown = false;

  availableAgencies: Agency[] = [];
  selectedAgencies: string[] = [];
  showAgencyDropdown = false;

  busPlans: BusPlanDTO[] = [];

  constructor(
    private shiftService: ShiftService,
    private circuitService: CircuitService,
    private agencyService: AgencyService,
    private busPlanService: BusPlanificationService,
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadAllData();
  }

  getWeekNumber(date: Date): number {
    try {
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
      const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
      return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    } catch (err) {
      this.handleError('ERROR.CALCULATING_WEEK', err);
      return 1; // Fallback to week 1
    }
  }

  changeWeek(weeks: number): void {
    try {
      this.currentDate.setDate(this.currentDate.getDate() + weeks * 7);
      this.currentWeek = this.getWeekNumber(this.currentDate);
      this.currentYear = this.currentDate.getFullYear();
      this.cdr.detectChanges();
    } catch (err) {
      this.handleError('ERROR.CHANGING_WEEK', err);
    }
  }

  loadAllData(): void {
    this.isLoading = true;
    this.clearError();

    forkJoin({
      shifts: this.shiftService.getAllShifts().pipe(catchError(() => of([]))),
      circuits: this.circuitService.getPaths().pipe(catchError(() => of([]))),
      agencies: this.agencyService.getAgencies().pipe(catchError(() => of([])))
    }).pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: ({ shifts, circuits, agencies }) => {
        this.availableShifts = shifts;
        this.availableCircuits = circuits;
        this.availableAgencies = agencies;
        this.clearError();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.handleError('ERROR.FETCHING_DATA', err);
      }
    });
  }

  toggleDayDropdown(): void {
    this.showDayDropdown = !this.showDayDropdown;
    this.cdr.detectChanges();
  }

  isDaySelected(day: string): boolean {
    return this.selectedDays.includes(day);
  }

  toggleDaySelection(day: string): void {
    try {
      if (this.isDaySelected(day)) {
        this.selectedDays = this.selectedDays.filter(d => d !== day);
      } else {
        this.selectedDays = [...this.selectedDays, day];
      }
      this.cdr.detectChanges();
    } catch (err) {
      this.handleError('ERROR.TOGGLING_DAY', err);
    }
  }

  toggleShiftDropdown(): void {
    this.showShiftDropdown = !this.showShiftDropdown;
    this.cdr.detectChanges();
  }

  isShiftSelected(shift: ShiftDTO): boolean {
    return this.selectedShifts.some(s => s.id === shift.id);
  }

  toggleShiftSelection(shift: ShiftDTO): void {
    try {
      if (this.isShiftSelected(shift)) {
        this.selectedShifts = this.selectedShifts.filter(s => s.id !== shift.id);
      } else {
        this.selectedShifts = [...this.selectedShifts, shift];
      }
      this.cdr.detectChanges();
    } catch (err) {
      this.handleError('ERROR.TOGGLING_SHIFT', err);
    }
  }

  toggleCircuitDropdown(): void {
    this.showCircuitDropdown = !this.showCircuitDropdown;
    this.cdr.detectChanges();
  }

  isCircuitSelected(circuit: string): boolean {
    return this.selectedCircuits.includes(circuit);
  }

  toggleCircuitSelection(circuit: string): void {
    try {
      if (this.isCircuitSelected(circuit)) {
        this.selectedCircuits = this.selectedCircuits.filter(c => c !== circuit);
      } else {
        this.selectedCircuits = [...this.selectedCircuits, circuit];
      }
      this.cdr.detectChanges();
    } catch (err) {
      this.handleError('ERROR.TOGGLING_CIRCUIT', err);
    }
  }

  toggleAgencyDropdown(): void {
    if (!this.allAgencies) {
      this.showAgencyDropdown = !this.showAgencyDropdown;
      this.cdr.detectChanges();
    }
  }

  isAgencySelected(agency: string): boolean {
    return this.selectedAgencies.includes(agency);
  }

  toggleAgencySelection(agency: string): void {
    try {
      if (this.isAgencySelected(agency)) {
        this.selectedAgencies = this.selectedAgencies.filter(a => a !== agency);
      } else {
        this.selectedAgencies = [...this.selectedAgencies, agency];
      }
      this.cdr.detectChanges();
    } catch (err) {
      this.handleError('ERROR.TOGGLING_AGENCY', err);
    }
  }

  executeAction(): void {
    this.isLoading = true;
    this.clearError();

    try {
      const formattedWeek = `KW-${this.currentYear}-${this.currentWeek.toString().padStart(2, '0')}`;
      this.week = formattedWeek;
      this.agencyId = this.allAgencies
        ? null
        : this.availableAgencies.find(a => this.selectedAgencies.includes(a.name))?.id || null;

      const request: BusPlanRequestDTO = {
        week: formattedWeek,
        agencyId: this.agencyId
      };

      if (this.operationType === 'load') {
        const selectedWeekdays = this.selectedDays;
        const selectedShiftIds = this.selectedShifts
          .map(s => s.id)
          .filter((id): id is number => id !== undefined);
        const selectedCircuitIds = this.availableCircuits
          .filter(c => this.selectedCircuits.includes(c.leoniSapReference))
          .map(c => c.id)
          .filter((id): id is number => id !== undefined);

        if (selectedWeekdays.length > 0) {
          request.weekdays = selectedWeekdays;
        }
        if (selectedShiftIds.length > 0) {
          request.shiftsIds = selectedShiftIds;
        }
        if (selectedCircuitIds.length > 0) {
          request.circuitIds = selectedCircuitIds;
        }
      }

      console.log('Request:', request);

      let apiCall: Observable<BusPlanDTO[]>;
      if (this.allAgencies) {
        apiCall = this.busPlanService.getAllByWeek(request);
      } else {
        apiCall = this.busPlanService.getByAgency(request);
      }

      apiCall.pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      ).subscribe({
        next: (data) => {
          this.busPlans = data;
          this.successMessage = this.translateService.instant(
            this.operationType === 'load' ? 'SUCCESS.DATA_LOADED' : 'SUCCESS.RECALCULATED'
          );
          console.log(this.successMessage)
          this.clearError();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.handleError('ERROR.LOADING_BUS_PLANS', err);
        }
      });
    } catch (err) {
      this.handleError('ERROR.EXECUTING_ACTION', err);
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  getShiftDisplay(shift: ShiftDTO): string {
    try {
      return `${shift.startTime} - ${shift.endTime}`;
    } catch (err) {
      this.handleError('ERROR.DISPLAYING_SHIFT', err);
      return '';
    }
  }

  private handleError(errorKey: string, error: any): void {
    console.error(errorKey, error);
    const rawMessage = error?.error?.message || error?.message || '';
    const parsed = parseServerErrorMessage(rawMessage);
    const translated = this.translateService.instant(errorKey);
    this.errorMessage = translated || this.translateService.instant('ERROR.UNEXPECTED');
    this.cdr.detectChanges();
  }

  private clearError(): void {
    this.errorMessage = null;
    this.cdr.detectChanges();
  }
}