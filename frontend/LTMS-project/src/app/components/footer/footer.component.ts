import { Component } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslateModule], // Import TranslateModule
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  constructor(private translate: TranslateService) {
    // Set default language
    translate.setDefaultLang('fr');
  }

  // Method to switch language
  switchLanguage(language: string) {
    this.translate.use(language);
  }
}
