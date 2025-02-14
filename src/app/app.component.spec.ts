import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let breakpointObserverSpy: jasmine.SpyObj<BreakpointObserver>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Erstellen der Spy-Objekte für die Abhängigkeiten
    const breakpointObserver = jasmine.createSpyObj('BreakpointObserver', ['observe']);
    const authService = jasmine.createSpyObj('AuthService', ['logout']);
    const router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AppComponent], // Standalone-Komponente
      providers: [
        { provide: BreakpointObserver, useValue: breakpointObserver },
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    breakpointObserverSpy = TestBed.inject(BreakpointObserver) as jasmine.SpyObj<BreakpointObserver>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set sidenavMode to "over" and sidenavOpened to false for handset mode', () => {
    // Simuliere, dass der Breakpoint für Handset aktiv ist
    breakpointObserverSpy.observe.and.returnValue(
      of({ 
        matches: true, 
        breakpoints: { [Breakpoints.Handset]: true } 
      })
    );
    component.ngOnInit();
    expect(component.sidenavMode).toBe('over');
    expect(component.sidenavOpened).toBeFalse();
  });

  it('should set sidenavMode to "side" and sidenavOpened to true for non-handset mode', () => {
    // Simuliere, dass der Breakpoint für Handset nicht aktiv ist
    breakpointObserverSpy.observe.and.returnValue(
      of({ 
        matches: false, 
        breakpoints: { [Breakpoints.Handset]: false } 
      })
    );
    component.ngOnInit();
    expect(component.sidenavMode).toBe('side');
    expect(component.sidenavOpened).toBeTrue();
  });

  it('should navigate to "/login" on successful logout', fakeAsync(() => {
    // Simuliere einen erfolgreichen Logout
    authServiceSpy.logout.and.returnValue(Promise.resolve());
    component.logout();
    tick();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should log error on logout failure', fakeAsync(() => {
    // Simuliere einen fehlgeschlagenen Logout
    const error = new Error('Logout error');
    authServiceSpy.logout.and.returnValue(Promise.reject(error));
    spyOn(console, 'error');
    component.logout();
    tick();
    expect(console.error).toHaveBeenCalledWith('Logout failed:', error);
  }));
});