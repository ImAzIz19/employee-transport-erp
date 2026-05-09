import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { UserDataComponent } from "../user-data/user-data.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-header',
  imports: [TranslateModule, UserDataComponent,RouterModule],
  templateUrl: './user-header.component.html',
  styleUrl: './user-header.component.css'
})
export class UserHeaderComponent {
  isLoading = false;
  errorMessage: string = '';
}
