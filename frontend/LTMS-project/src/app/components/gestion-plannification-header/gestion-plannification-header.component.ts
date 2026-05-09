import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { HistoriqueRecapDialogComponent } from '../planification/historique-recap-dialog/historique-recap-dialog.component';
import { PlanningDownloadDialogComponent } from '../planification/planning-download-dialog/planning-download-dialog.component';
import { ShuttlesDashboardDialogComponent } from '../planification/shuttles-dashboard-dialog/shuttles-dashboard-dialog.component';
import { GestionPlannificationBodyComponent } from "../gestion-plannification-body/gestion-plannification-body.component";

@Component({
  selector: 'app-gestion-plannification-header',
  templateUrl: './gestion-plannification-header.component.html',
  styleUrls: ['./gestion-plannification-header.component.css'],
  imports: [TranslateModule, GestionPlannificationBodyComponent]
})
export class GestionPlannificationHeaderComponent {
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private translate: TranslateService,
    private dialog: MatDialog
  ) {}

  openHistoriqueRecap(): void {
    this.dialog.open(HistoriqueRecapDialogComponent, {
      width: '800vw',
      maxWidth: '900px',
      data: { 
        title: this.translate.instant('HISTORY_RECAP')
      }
    });
  }

  openPlanningDownload(): void {
    if (this.isLoading) return;
    
    this.isLoading = true;
    const dialogRef = this.dialog.open(PlanningDownloadDialogComponent, {
      width: '80vw',
      maxWidth: '900px',
      data: { 
        title: this.translate.instant('PLANNING_DOWNLOAD')
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.isLoading = false;
    });
  }

  openShuttlesDashboard(): void {
    this.dialog.open(ShuttlesDashboardDialogComponent, {
      width: '80vw',
      maxWidth: '900px',
      data: { 
        title: this.translate.instant('SHUTTLES_DASHBOARD')
      }
    });
  }

  downloadPlanning() {
    // This can now be moved to the PlanningDownloadDialogComponent
  }
}