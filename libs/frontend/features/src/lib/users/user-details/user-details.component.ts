import { Component, OnInit } from '@angular/core';
import { IUserInfo } from '../../../../../../shared/api/src';
import { UserService } from '../user.service';

@Component({
  standalone: false,
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styles: []
})
export class UserDetailsComponent implements OnInit {
  userDetails: IUserInfo | null = null;
  errorMessage: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getCurrentUserDetails();
  }

  getCurrentUserDetails(): void {
    this.userService.getCurrentUser().subscribe({
      next: (response: any) => {
        console.log('Full API Response:', response);
        if (response) {
          this.userDetails = response; // ✅ Direct opslaan
          console.log('Loaded user details:', this.userDetails);
        } else {
          console.error('No user details found in response:', response);
        }
      },
      error: (err) => {
        this.errorMessage = 'Failed to load user details.';
        console.error(this.errorMessage, err);
      }
    });
  }
}
