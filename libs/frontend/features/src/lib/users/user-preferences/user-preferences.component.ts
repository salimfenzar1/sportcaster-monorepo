import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IUserInfo } from '../../../../../../shared/api/src';
import { SportType, SportIntensity, Equipment } from '../../../../../../shared/api/src';

@Component({
    standalone: false,
  selector: 'app-user-preferences',
  templateUrl: './user-preferences.component.html',
  styleUrls: ['./user-preferences.component.css']
})
export class UserPreferencesComponent implements OnInit {
  user!: IUserInfo;
  preferencesForm!: FormGroup;

  availableSportTypes = Object.values(SportType);
  availableEquipment = Object.values(Equipment);
  availableIntensities = Object.values(SportIntensity);

  constructor(private userService: UserService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadUserPreferences();
  }

  loadUserPreferences(): void {
    this.userService.getCurrentUser().subscribe((user: IUserInfo) => {
      this.user = user;

      this.user.preferences = this.user.preferences || {
        sportTypes: [],
        isIndoor: false,
        equipment: [],
        intensity: SportIntensity.Medium
      };

      this.preferencesForm = this.fb.group({
        sportTypes: [this.user.preferences.sportTypes || []],
        isIndoor: [this.user.preferences.isIndoor],
        equipment: [this.user.preferences.equipment || []],
        intensity: [this.user.preferences.intensity || SportIntensity.Medium]
      });
    });
  }

  toggleSelection(field: string, value: string): void {
    const selectedValues = this.preferencesForm.value[field] || [];
    if (selectedValues.includes(value)) {
      this.preferencesForm.patchValue({ [field]: selectedValues.filter((v: string) => v !== value) });
    } else {
      this.preferencesForm.patchValue({ [field]: [...selectedValues, value] });
    }
  }

  savePreferences(): void {
    const updatedPreferences = this.preferencesForm.value;
    this.userService.updateUserPreferences(this.user._id, updatedPreferences).subscribe(() => {
      alert('Preferences updated successfully!');
    });
  }
}
