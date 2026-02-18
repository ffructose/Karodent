import { Component } from '@angular/core';

@Component({
  selector: 'app-results',
  standalone: false,
  templateUrl: './results.html',
  styleUrl: './results.css',
})
export class Results {
  scrollToFooter() {
    const footer = document.getElementById('page-footer');
    if (footer) footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
