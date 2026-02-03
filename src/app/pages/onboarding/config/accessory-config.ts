import { HeadphonesPreferencesContentComponent } from '../components/headphones-preferences-content.component';
import { MousePreferencesContentComponent } from '../components/mouse-preferences-content.component';
import { KeyboardPreferencesContentComponent } from '../components/keyboard-preferences-content.component';
import { ChargerPreferencesContentComponent } from '../components/charger-preferences-content.component';
import {
  AccessoryConfig,
  HeadphonesPreferencesPayload,
  MousePreferencesPayload,
  KeyboardPreferencesPayload,
  ChargerPreferencesPayload,
} from '@app/shared/models/accessory-preferences.model';

export const ACCESSORY_CONFIGS: AccessoryConfig[] = [
  {
    key: 'headphones',
    icon: 'headphones',
    title: 'Headphones',
    subtitle: 'Audio quality and comfort',
    defaultValues: { feature: 'noise-cancelling', budget: 'medium' } as HeadphonesPreferencesPayload,
    component: HeadphonesPreferencesContentComponent,
  },
  {
    key: 'mouse',
    icon: 'mouse',
    title: 'Mouse',
    subtitle: 'Precision and ergonomics',
    defaultValues: { profile: 'office', budget: 'medium' } as MousePreferencesPayload,
    component: MousePreferencesContentComponent,
  },
  {
    key: 'keyboard',
    icon: 'keyboard',
    title: 'Keyboard',
    subtitle: 'Typing feel and layout',
    defaultValues: { type: 'silent', budget: 'medium' } as KeyboardPreferencesPayload,
    component: KeyboardPreferencesContentComponent,
  },
  {
    key: 'charger',
    icon: 'power',
    title: 'Charger',
    subtitle: 'Power and connectivity',
    defaultValues: { feature: 'multi-port', budget: 'medium' } as ChargerPreferencesPayload,
    component: ChargerPreferencesContentComponent,
  },
];
