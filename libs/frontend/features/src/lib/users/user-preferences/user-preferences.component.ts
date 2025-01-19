import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IUserInfo } from '../../../../../../shared/api/src';
import { SportType, SportIntensity, Equipment } from '../../../../../../shared/api/src';

@Component({
  standalone: false,
  selector: 'app-user-preferences',
  templateUrl: './user-preferences.component.html',
  styleUrls: ['./user-preferences.component.css'],
})
export class UserPreferencesComponent implements OnInit {
  user!: IUserInfo;
  preferencesForm!: FormGroup;
  isEditing = false; // Control editing state
  availableSportTypes = Object.values(SportType);
  availableEquipment = Object.values(Equipment);
  availableIntensities = Object.values(SportIntensity);

  constructor(private userService: UserService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadUserPreferences();
    this.preferencesForm = this.fb.group({
      isIndoor: [{ value: this.user.preferences?.isIndoor, disabled: true }],
      sportTypes: [{ value: this.user?.preferences?.sportTypes || [], disabled: true }],
    })
  }

  loadUserPreferences(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user: IUserInfo) => {
        this.user = user;

        // Ensure default preferences if none exist
        this.user.preferences = this.user.preferences || {
          sportTypes: [],
          isIndoor: null,
          equipment: [],
          intensity: SportIntensity.Medium,
        };
        

        // Initialize the form with user preferences
        this.preferencesForm = this.fb.group({
          sportTypes: [this.user.preferences.sportTypes || []], // Single selection for sport type
          isIndoor: [this.user.preferences.isIndoor],
          equipment: [this.user.preferences.equipment || []],
          intensity: [this.user.preferences.intensity || SportIntensity.Medium],
        });

        // Disable the form controls initially
        this.preferencesForm.disable();
      },
      error: (err) => {
        console.error('Error loading preferences:', err);
      },
    });
  }
  toggleSportTypeSelection(sportType: string): void {
    const selectedSportTypes = this.preferencesForm.value.sportTypes || [];
    if (selectedSportTypes.includes(sportType)) {
      // Remove the sport type
      this.preferencesForm.patchValue({
        sportTypes: selectedSportTypes.filter((type: string) => type !== sportType),
      });
    } else {
      // Add the sport type
      this.preferencesForm.patchValue({
        sportTypes: [...selectedSportTypes, sportType],
      });
    }
  }

  toggleSelection(field: string, value: string): void {
    const selectedValues = this.preferencesForm.value[field] || [];
    if (selectedValues.includes(value)) {
      this.preferencesForm.patchValue({
        [field]: selectedValues.filter((v: string) => v !== value),
      });
    } else {
      this.preferencesForm.patchValue({
        [field]: [...selectedValues, value],
      });
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;

    // Enable or disable form controls based on isEditing
    if (this.isEditing) {
      this.preferencesForm.enable();
      this.preferencesForm.get('isIndoor')?.enable(); 
    } else {
      this.preferencesForm.disable();
      this.preferencesForm.get('isIndoor')?.disable(); 
      this.preferencesForm.get('sportTypes')?.disable();
    }
  }

  saveOrEditPreferences(): void {
    if (this.isEditing) {
      // Haal bijgewerkte voorkeuren op uit het formulier
      const updatedPreferences = { ...this.preferencesForm.value };
  
      // Verwijder isIndoor als de waarde null is
      if (updatedPreferences.isIndoor === null) {
        delete updatedPreferences.isIndoor;
      }
  
      this.userService.updateUserPreferences(this.user._id, updatedPreferences).subscribe({
        next: () => {
          alert('Preferences updated successfully!');
          this.toggleEdit(); // Disable fields after saving
        },
        error: (err) => {
          console.error('Error updating preferences:', err);
          alert('Failed to update preferences. Please try again.');
        },
      });
    } else {
      // Schakel bewerkingsmodus in
      this.toggleEdit();
    }
  }
  
}
