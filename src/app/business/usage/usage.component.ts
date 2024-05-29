import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-usage',
  standalone: true,
  imports: [],
  templateUrl: './usage.component.html',
  styles: `:host {
    display: block;
  }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UsageComponent {}
