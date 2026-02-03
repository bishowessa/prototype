import { Component, EventEmitter, Output } from '@angular/core';
import { OnboardingProfileCardComponent } from '../../components/onboarding-profile-card.component';

@Component({
  selector: 'app-onboarding-profile-step',
  standalone: true,
  imports: [OnboardingProfileCardComponent],
  templateUrl: './onboarding-profile-step.component.html',
})
export class OnboardingProfileStepComponent {
  @Output() readonly skip = new EventEmitter<void>();

  protected readonly profiles = [
    {
      icon: 'school',
      title: 'Student on a Budget',
      description:
        'Focus on value-for-money, durability, and essential productivity features for education.',
    },
    {
      icon: 'home_work',
      title: 'Remote Worker',
      description:
        'Prioritizing video conferencing tools, ergonomic gear, and reliable peripherals for home office.',
    },
    {
      icon: 'sports_esports',
      title: 'Gamer',
      description:
        'High-performance specs, refresh rates, and the latest hardware for the ultimate gaming experience.',
    },
    {
      icon: 'movie_edit',
      title: 'Content Creator',
      description:
        'Emphasis on color accuracy, processing power for editing, and audio/video equipment.',
    },
    {
      icon: 'terminal',
      title: 'Developer',
      description:
        'Optimized for compiling speeds, multi-monitor setups, and high-performance workstations.',
    },
    {
      icon: 'flight_takeoff',
      title: 'Frequent Traveler',
      description:
        'Portability, battery life, and durability are key for staying productive on the go.',
    },
  ] as const;

  protected onSkip(): void {
    this.skip.emit();
  }
}
