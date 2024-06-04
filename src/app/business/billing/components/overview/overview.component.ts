import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { UsageService } from '@services/usage.service';

import { initFlowbite } from 'flowbite';


@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent implements OnInit {
  
  public usageService = inject(UsageService);
  
  constructor(){}
  
  ngOnInit(): void {
    initFlowbite();
  }
}
