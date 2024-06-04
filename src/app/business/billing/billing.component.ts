import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { BillingHistoryComponent } from './components/billing-history/billing-history.component';
import { OverviewComponent } from './components/overview/overview.component';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [
    CommonModule,

    BillingHistoryComponent,
    OverviewComponent,
  ],
  templateUrl: './billing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BillingComponent implements OnInit {
  ngOnInit(): void {
    initFlowbite();
  }
}
