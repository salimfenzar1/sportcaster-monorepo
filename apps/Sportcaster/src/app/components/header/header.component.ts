import { Component } from '@angular/core';

@Component({
    standalone:false,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  onLoginClick(): void {
    alert('Login clicked!');
  }

  onRegisterClick(): void {
    alert('Register clicked!');
  }
}
