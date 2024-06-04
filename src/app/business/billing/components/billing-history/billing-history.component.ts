import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-billing-history',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './billing-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingHistoryComponent { }
