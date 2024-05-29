import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import PricingComponent from '../pricing/pricing.component';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [
    CommonModule,

    PricingComponent
  ],
  templateUrl: './info.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class InfoComponent { }
