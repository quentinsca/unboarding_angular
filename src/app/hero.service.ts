import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) {}

  private heroesUrl = 'api/heroes';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  getHero(id: number): Observable<Hero> {

    const heroUrl = this.heroesUrl + `/${id}`;
    return this.http.get<Hero>(heroUrl).pipe(
      tap((_) => this.log('fecthed hero')),
      catchError(this.handleError<Hero>('getHero'))
    );
  }

  private log(message: string): void {
    this.messageService.add(message);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      this.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** GET heroes from the server */
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap((_) => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http
      .put<Hero>(`${this.heroesUrl}/${hero.id}`, hero, this.httpOptions)
      .pipe(
        tap((_) => this.log(`updated hero id=${hero.id}`)),
        catchError(this.handleError<any>('updateHero'))
      );
  }

  addHero(hero: Hero): Observable<any> {
    return this.http
      .post<Hero>(`${this.heroesUrl}`, hero, this.httpOptions)
      .pipe(
        tap((_) => this.log(`added hero name=${hero.name}`)),
        catchError(this.handleError<any>('addHero'))
      );
  }

  deleteHero(id: number): Observable<any> {
    return this.http
      .delete<Hero>(`${this.heroesUrl}/${id}`, this.httpOptions)
      .pipe(
        tap((_) => this.log(`deleteed hero id=${id}`)),
        catchError(this.handleError<any>('deleteHero'))
      );
  }

  searchHero(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}?name=${term}`).pipe(
      tap((_) => this.log(`search hero term=${term}`)),
      catchError(this.handleError<any>('searchHero'))
    );
  }
}
