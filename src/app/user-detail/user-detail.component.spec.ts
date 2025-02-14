import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserDetailComponent } from './user-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { User } from '../../models/user.class';
import * as FirestoreFns from '@angular/fire/firestore';

describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;
  let activatedRouteStub: Partial<ActivatedRoute>;
  let routerSpy: jasmine.SpyObj<Router>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let firestoreStub: any;

  beforeEach(async () => {
    // Stub für ActivatedRoute mit minimal benötigten Eigenschaften
    activatedRouteStub = {
      snapshot: {
        params: { id: 'test-id' }
      }
    } as any as ActivatedRoute;

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    firestoreStub = {};

    await TestBed.configureTestingModule({
      imports: [UserDetailComponent], // Standalone-Komponente
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: routerSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: 'Firestore', useValue: firestoreStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('editAddressMenu should open dialog and update user on close', () => {
    // Initialisiere die Komponente mit einem vollständigen User-Objekt
    const initialUser = new User({
      id: 'test-id',
      firstName: 'Initial',
      lastName: 'User',
      birthDate: 1234567890, // Beispiel-Timestamp
      street: 'Initial Street',
      city: 'Initial Address'
    });
    component.user = initialUser;

    // Erstelle ein aktualisiertes User-Objekt, das vom Dialog zurückgegeben werden soll
    const updatedUser = new User({
      id: 'test-id',
      firstName: 'Initial',
      lastName: 'User',
      birthDate: 1234567890,
      street: 'Initial Street',
      city: 'Neue Adresse'
    });

    // Erstelle ein Spy-Objekt für den Dialog-Ref, das nach dem Schließen updatedUser liefert
    const dialogRefSpyObj = {
      afterClosed: () => of(updatedUser)
    };

    dialogSpy.open.and.returnValue(dialogRefSpyObj as any);

    // Rufe die Methode auf, die den Dialog öffnet und den User aktualisiert
    component.editAddressMenu();

    // Prüfe, ob der Dialog geöffnet wurde und der User aktualisiert wurde
    expect(dialogSpy.open).toHaveBeenCalled();
    expect(component.user).toEqual(updatedUser);
  });

  describe('delete', () => {
    let originalConfirm: any;

    beforeEach(() => {
      originalConfirm = window.confirm;
    });

    afterEach(() => {
      window.confirm = originalConfirm;
    });

    it('should not delete if confirmation is cancelled', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      component.delete();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should log error if userID is empty', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      component.userID = '';
      spyOn(console, 'error');
      component.delete();
      expect(console.error).toHaveBeenCalledWith('Keine User-ID vorhanden, Löschung nicht möglich.');
    });

    it('should delete user and navigate on successful deletion', fakeAsync(() => {
      spyOn(window, 'confirm').and.returnValue(true);
      component.userID = 'test-id';
      // Simuliere deleteDoc als erfolgreich aufgelösten Promise
      spyOn(FirestoreFns, 'deleteDoc').and.returnValue(Promise.resolve());

      component.delete();
      tick();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/user']);
    }));

    it('should log error on deletion failure', fakeAsync(() => {
      spyOn(window, 'confirm').and.returnValue(true);
      component.userID = 'test-id';
      const error = new Error('Deletion error');
      spyOn(FirestoreFns, 'deleteDoc').and.returnValue(Promise.reject(error));
      spyOn(console, 'error');

      component.delete();
      tick();

      expect(console.error).toHaveBeenCalledWith('Error deleting user:', error);
    }));
  });
});