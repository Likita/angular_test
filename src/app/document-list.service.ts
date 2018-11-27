import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Document } from './document';
import { MessageService } from './message.service';
import { BehaviorSubject } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class DocumentListService {
  private documentListUrl = 'api/document';
  private userListUrl = 'api/user';

  private userList$ = new BehaviorSubject([]);
  userList = this.userList$.asObservable();

  private documentList$ = new BehaviorSubject(<any>{});
  documentList = this.documentList$.asObservable();

  private document$ = new BehaviorSubject(<any>{});
  document = this.document$.asObservable();

  private id$ = new BehaviorSubject(0);
  id = this.id$.asObservable();

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private location: Location,
  ) { }

  getDocumentList(): void {
    this.http.get<object>(`${this.documentListUrl}`)
      .pipe(
        catchError(this.handleError('getDocumentList failed', []))
      ).subscribe(documentList => {
        this.documentList$.next(documentList);
      });
  }

  getDocumentNo404<Data>(id: number): Observable<Document> {
    const url = `${this.documentListUrl}/?id=${id}`;
    return this.http.get<Document[]>(url)
      .pipe(
        map(documentList => documentList[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} document id=${id}`, 'error');
        }),
        catchError(this.handleError<Document>(`getDocument id=${id} failed`))
      );
  }

  searchTitleDocumentList(title: string): Observable<any> {
    if (!title.trim()) {
      // if not search title, return empty document array.
      return of([]);
    }
    return this.http.get<any>(`${this.documentListUrl}/?title=${title}`).pipe(
      // tap(_ => this.log(`found documentList matching "${title}"`, 'success')),
      catchError(this.handleError<Document[]>('searchTitleDocumentList failed', []))
    );
  }

  searchLockedDocumentList(locked: boolean): Observable<any> {
    return this.http.get<any>(`${this.documentListUrl}/?locked=${locked}`).pipe(
      // tap(_ => this.log(`found documentList matching "${locked}"`, 'success')),
      catchError(this.handleError<Document[]>('searchLockedDocumentList failed', []))
    );
  }

  getDocument(id: number): Observable<Document> {
    const url = `${this.documentListUrl}/${id}`;
    return this.http.get<Document>(url).pipe(
      tap((document) => {
        if (!document.id) {
          this.location.back();
          this.log(`Sorry, document with id=${id} does not exist`, 'error');
          this.handleError<Document>(`getDocument id=${id} failed`);
        } else {
          this.document$.next(document);
          // this.log(`fetched document id=${id}`, 'success')}
        }
      }),
      catchError(this.handleError<Document>(`getDocument id=${id} failed`))
    );
  }

  updateDocument (id: number, title: string, data: any): Observable<Document> {
    const url = `${this.documentListUrl}/${id}`;

    return this.http.patch<any>(url, JSON.stringify(data), httpOptions).pipe(
      tap(_ => this.log(`Document ${title} successfully saved`, 'success')),
      catchError(this.handleError<Document>(`Document ${title} not saved`))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation failed', result?: T) {
    return (error: any): Observable<T> => {
      this.log(`${operation}. Error ${error.message}`, 'error');

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(text: string, type: string) {
    const notification = {
      text,
      type,
    }
    this.messageService.add(notification);
  }

  dateFormat(str: number) {
    const date = new Date(str * 1000);
    var options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleString('en', options);
  }

  getUserList(): void {
    this.http.get<any>(`${this.userListUrl}`)
      .pipe(
        catchError(this.handleError('getUserList failed', []))
      ).subscribe(userList => {
        this.userList$.next(userList.items);
      })
  }

  clearOldDoc(): void {
    this.document$.next({});
  }

  setId(id: number): void {
    this.id$.next(id);
  }

  isEmpty(obj) {
    for(var prop in obj) {
      if(obj.hasOwnProperty(prop))
        return false;
    }
    return true;
  }
}
