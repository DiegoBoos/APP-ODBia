import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { initFlowbite } from 'flowbite';


@Component({
  standalone: true,
  imports: [
    RouterModule,

    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './landing.component.html',
})
export default class LandingComponent implements OnInit {

  ngOnInit(): void {
    initFlowbite();
  }
}
