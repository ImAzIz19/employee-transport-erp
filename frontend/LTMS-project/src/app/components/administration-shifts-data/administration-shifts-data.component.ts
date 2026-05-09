import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { ShiftService } from '../../services/shift/shift-service.service';
import { ShiftDTO } from '../../interface/shift/shift';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';
import { ShiftEditDialogComponent } from '../shift-edit-dialog/shift-edit-dialog.component';

@Component({
  selector: 'app-administration-shifts-data',
  templateUrl: './administration-shifts-data.component.html',
  styleUrls: ['./administration-shifts-data.component.scss'],
  imports: [ MatPaginatorModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,MatIcon,TranslateModule]
})
export class AdministrationShiftsDataComponent implements OnInit {
  displayedColumns: string[] = ['id', 'startTime', 'endTime', 'mode', 'actions'];
  dataSource = new MatTableDataSource<ShiftDTO>([]);
  filteredData: ShiftDTO[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  pageSize = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private shiftService: ShiftService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar

  ) {}

  ngOnInit(): void {
    this.loadShifts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadShifts(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.shiftService.getAllShifts().subscribe({
      next: (shifts) => {
        this.dataSource.data = shifts;
        this.filteredData = [...shifts];
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = this.translate.instant('ERROR.FETCH_SHIFTS');
        this.isLoading = false;
      }
    });
  }

  formatTime(timeString: string): string {
    return timeString.replace(/(\d{2})(\d{2})/, '$1:$2');
  }

editShift(shift: ShiftDTO): void {
  // Create a deep copy of the shift to avoid modifying the original object
  const shiftCopy = JSON.parse(JSON.stringify(shift));
  
  const dialogRef = this.dialog.open(ShiftEditDialogComponent, {
    width: '500px',
    data: { shift: shiftCopy },
    disableClose: true // Prevent closing by clicking outside
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.isLoading = true; // Show loading state
      this.errorMessage = null; // Clear previous errors
      
      this.shiftService.modifyShift(result.id, result).subscribe({
        next: (updatedShift) => {
          this.isLoading = false;
          // Update the data source immutably
          this.dataSource.data = this.dataSource.data.map(item => 
            item.id === updatedShift.id ? updatedShift : item
          );
          
          // Optional: Show success notification
          this.snackBar.open(
            this.translate.instant('SUCCESS.SHIFT_UPDATED'),
            'Close',
            { duration: 3000 }
          );
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = this.translate.instant(
            error.status === 409 ? 'ERROR.SHIFT_CONFLICT' : 'ERROR.UPDATE_SHIFT'
          );
          
          // Log the full error for debugging
          console.error('Shift update error:', error);
        }
      });
    }
  });
}

  deleteShift(shiftId: number): void {
    // Confirm before deleting
    if (confirm(this.translate.instant('CONFIRM.DELETE_SHIFT'))) {
      // In a real implementation, call shiftService.deleteShift(shiftId)
      this.dataSource.data = this.dataSource.data.filter(shift => shift.id !== shiftId);
      this.filteredData = this.filteredData.filter(shift => shift.id !== shiftId);
    }
  }

  onPageChange(event: any): void {
    // Handle pagination changes if needed
  }

  // Optional filter implementation
  onFilterChange(filter: any): void {
    // Implement filtering logic if needed
  }
}