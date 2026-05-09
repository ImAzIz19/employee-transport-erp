import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PlanificationDTO } from '../../interface/planification/planificatio';
import { PlanificationService } from '../../services/planification/planification.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-planification-details',
  standalone: true,
  imports: [TranslateModule,FormsModule,NgIf],
  templateUrl: './planification-details.component.html',
  styleUrl: './planification-details.component.css'
})
export class PlanificationDetailsComponent {
  planificationDetails: PlanificationDTO[] = [];
  currentPlanification?: PlanificationDTO; // Using optional (?) instead of null

  constructor(private planificationService: PlanificationService) {}

  ngOnInit(): void {
    this.loadPlanificationDetails();
  }

  loadPlanificationDetails(): void {
    this.planificationService.getAll().subscribe({
      next: (planifications) => {
        this.planificationDetails = planifications;
        if (this.planificationDetails.length > 0) {
          this.currentPlanification = this.planificationDetails[0];
        }
      },
      error: (error) => {
        console.error('Error loading planification details:', error);
      }
    });
  }
}