import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlarmModel } from '../models/alarm.model';

@Injectable()
export class AlarmService {
  url = BASE_API_URL;
  headers = new HttpHeaders().set('Authorization', AUTHORIZATION_KEY);

  constructor(private http: HttpClient) {
  }

  // Get alarm data based on provided parameters
  getAlarms(page: number, pageSize: number, severity: string = '', dateFilter: string = ''): Observable<AlarmModel> {
    const filter = severity ? `&severity=${severity}` : '';
    return this.http.get<AlarmModel>(`${this.url}?currentPage=${page}&pageSize=${pageSize}${filter}${dateFilter}`, {'headers': this.headers});
  }

  // Gets total alarm amount for pagination
  getAlarmCount(): Observable<any> {
    return this.http.get<number>(`${this.url}/count`, {'headers': this.headers});
  }
}
