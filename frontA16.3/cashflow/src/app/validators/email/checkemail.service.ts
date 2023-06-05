import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

//const EMAILS = [''];

@Injectable({ providedIn: 'root' })
export class CheckeMailService {
  private URL = environment.AUTH_URL;
  private _httpClient = inject(HttpClient);

  /*
  isMailTaken(eMail: string): Observable<boolean> {
    const isTaken = EMAILS.includes(eMail);
    return of(isTaken).pipe(delay(400));
  }
  */
  emailFind(email:string): Observable<boolean | null> {
    return this._httpClient
    .get(`${this.URL}/emailcheck/${email}`)
    .pipe(map( (x:any) => {
      if (x.exists) return true;
      else return  false;
    }))
 }

}
