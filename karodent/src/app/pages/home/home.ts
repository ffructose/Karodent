import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  scrollToFooter() {
  const footer = document.getElementById('page-footer');
  if (footer) {
    footer.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

}
