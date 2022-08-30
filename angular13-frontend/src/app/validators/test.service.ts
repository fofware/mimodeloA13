import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { environment } from 'src/environments/environment';

const ALTER_EGOS = ['fofware@hotmail.com'];

@Injectable({ providedIn: 'root' })
export class HeroesService {
  private URL = environment.AUTH_URL;
  constructor(
    private api: ApiService,
    private httpClient: HttpClient
    ){}
  isAlterEgoTaken(alterEgo: string): Observable<boolean> {
    const isTaken = ALTER_EGOS.includes(alterEgo);

    return of(isTaken).pipe(delay(400));
  }

  emailFind(email:string): Observable<boolean | null> {
    return this.httpClient
    .get(`${this.URL}/emailcheck/${email}`)
    .pipe(map( (x:any) => {
      if (x.exists) return true;
      else return  false;
    }))
 }

}