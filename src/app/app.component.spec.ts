import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AlarmService } from './services/alarm.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [AlarmService, HttpClient, HttpHandler]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should set initial values`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.alarmCountTotal).toEqual(5);
    expect(app.page).toEqual(0);
    expect(app.dateFilter).toEqual('');
  });
});

