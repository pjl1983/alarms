import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AlarmService } from './services/alarm.service';
import { forkJoin, ReplaySubject } from 'rxjs';
import { Alarm, AlarmModel, SeverityEnum, Statistics } from './models/alarm.model';
import { switchMap, takeUntil } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private alarmObservable$: ReplaySubject<number> = new ReplaySubject(0);
  displayedColumns: string[] = ['id', 'severity', 'name', 'status', 'connectorId', 'count', 'creationTime', 'time', 'type', 'firstOccurrenceTime'];
  dataSource: MatTableDataSource<Alarm>;
  severityEnum = SeverityEnum;
  severityFilter: string = '';
  statistics: Statistics;
  alarmCountTotal: number = 5; // Total number of Alarms.
  pageSize: number = 5; // Number of items to display on a page.
  page: number = 0; // The zero-based page index of the displayed list of items. Defaulted to 0.
  dateFilter: string = ''; // Filters the occurrence date.

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private alarmService: AlarmService) {
  }

  ngOnInit() {
    this.alarmObservable$.pipe(
      switchMap(() => {
        return forkJoin([this.alarmService.getAlarms((this.page + 1), this.pageSize, this.severityFilter, this.dateFilter), this.alarmService.getAlarmCount()])
      }),
      takeUntil(this.destroyed$)
    ).subscribe(([alarm, alarmCountTotal]: [AlarmModel, number]) => {
      this.statistics = alarm.statistics as Statistics;
      this.alarmCountTotal = alarmCountTotal;
      this.dataSource = new MatTableDataSource(alarm.alarms);
      this.dataSource.sort = this.sort;
    });

    // Listens for date value changes and applies date filter to query
    this.range.valueChanges.subscribe((datePicker: { start: Date, end: Date }) => {
      if (datePicker.start && datePicker.end) {
        const startDate: string = moment(datePicker.start).format("YYYY-MM-DD");
        const endDate: string = moment(datePicker.end).format("YYYY-MM-DD");
        this.dateFilter = `&dateFrom=${startDate}&dateTo=${endDate}`;
        this.alarmObservable$.next();
      }
    });

    // Get initial display values
    this.alarmObservable$.next();
  }

  // Clears calender and date filter
  clearDateFilter() {
    this.dateFilter = '';
    this.range.reset();
    this.alarmObservable$.next();
  }

  // Gets next or previous page
  goToPage(event: PageEvent) {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.alarmObservable$.next();
  }

  // Filters alarms based on severity
  filterBySeverity(event: any) {
    this.severityFilter = SeverityEnum[event.value];
    this.alarmObservable$.next()
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
