import { Component, EventEmitter, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { OnboardingStateService } from '@app/core/services/onboarding-state.service';
import { PROFILE_PRESETS, ProfileType } from '../../config/profile-presets.config';
import { IconComponent } from '@app/shared/components/icon/icon.component';

interface Profile {
  id: ProfileType;
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-onboarding-profile-step',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './onboarding-profile-step.component.html',
})
export class OnboardingProfileStepComponent {
  @Output() readonly skip = new EventEmitter<void>();

  private readonly router = inject(Router);
  private readonly onboardingState = inject(OnboardingStateService);

  protected readonly profiles: Profile[] = [
    {
      id: 'student',
      icon: 'school',
      title: 'Student on a Budget',
      description:
        'Focus on value-for-money, durability, and essential productivity features for education.',
    },
    {
      id: 'remote-worker',
      icon: 'home_work',
      title: 'Remote Worker',
      description:
        'Prioritizing video conferencing tools, ergonomic gear, and reliable peripherals for home office.',
    },
    {
      id: 'gamer',
      icon: 'sports_esports',
      title: 'Gamer',
      description:
        'High-performance specs, refresh rates, and the latest hardware for the ultimate gaming experience.',
    },
    {
      id: 'content-creator',
      icon: 'movie_edit',
      title: 'Content Creator',
      description:
        'Emphasis on color accuracy, processing power for editing, and audio/video equipment.',
    },
    {
      id: 'developer',
      icon: 'terminal',
      title: 'Developer',
      description:
        'Optimized for compiling speeds, multi-monitor setups, and high-performance workstations.',
    },
    {
      id: 'frequent-traveler',
      icon: 'flight_takeoff',
      title: 'Frequent Traveler',
      description:
        'Portability, battery life, and durability are key for staying productive on the go.',
    },
  ];

  protected onSkip(): void {
    this.skip.emit();
  }

  protected onProfileSelect(profileId: ProfileType): void {
    const presets = PROFILE_PRESETS[profileId];
    this.onboardingState.applyProfilePresets(profileId, presets as Record<string, unknown>);

    void this.router.navigate(['/onboarding', '5']);
  }
}
