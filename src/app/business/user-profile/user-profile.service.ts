import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environment/environment';
import { Observable, catchError, map, of } from 'rxjs';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  constructor() {}

  findUser(id: string): Observable<any> {
    const url = `${this.baseUrl}/user/${id}`;
    return this.http.get<User>(url).pipe(catchError(() => of()));
  }

  updateUser(user: User) {
    const url = `${this.baseUrl}/user/${user.id}`;

    const requestObservable = this.http.patch(`${url}`, user);
    return requestObservable.pipe(
      map((data: any) => {
        return data;
      }),
      catchError(() => of(false))
    );
  }
}
