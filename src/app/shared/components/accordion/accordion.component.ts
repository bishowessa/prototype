import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IconComponent } from '@app/shared/components/icon/icon.component';

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './accordion.component.html',
})
export class AccordionComponent implements OnInit {
  @Input() icon = '';
  @Input() title = '';
  @Input() subtitle = '';
  @Input() initialOpen = false;
  @Input() skippable = false;
  @Input() skipLabel = 'Skip this accessory';

  @Output() readonly skip = new EventEmitter<void>();
  @Output() readonly openedChange = new EventEmitter<boolean>();

  protected open = false;

  ngOnInit(): void {
    this.open = this.initialOpen;
  }

  protected toggle(): void {
    this.open = !this.open;
    this.openedChange.emit(this.open);
  }

  protected onSkip(event: Event): void {
    event.stopPropagation();
    this.skip.emit();
  }
}
