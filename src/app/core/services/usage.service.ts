import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { Usage } from '@interfaces/usage.interface';
import { catchError, map, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsageService {

  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  #usage = signal<Usage | undefined>(undefined);
  usagePercentage = signal(0);

  public usage = computed(() => this.#usage());

  constructor() {
    this.getUsageStatistics().subscribe();
  }
  
  getUsageStatistics() {
    const url = `${this.baseUrl}/usage/statistics`;
    return this.http.get<Usage>(url).pipe(
      map((usage) => this.#usage.set(usage)),
      catchError(() => of())
    );
  }

  resetState() {
    this.#usage.set(undefined);
  }

  createCheckout() {
    const url = `${this.baseUrl}/stripe/create-checkout`;
    return this.http.get<any>(url).pipe(
      map(({url}) => url),
      catchError(() => of())
    );
  }

}
