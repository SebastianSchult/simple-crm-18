import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserComponent } from './user.component';
import { MatDialog } from '@angular/material/dialog';
import { Firestore } from '@angular/fire/firestore';
import { of } from 'rxjs';
import * as FirestoreFns from '@angular/fire/firestore';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;
  let firestoreStub: any;

  beforeEach(async () => {
    // Erstelle einen Spy für MatDialog
    matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    // Erstelle einen einfachen Firestore-Stubb; cast zu any, um Typprobleme zu vermeiden
    firestoreStub = {} as any;

    await TestBed.configureTestingModule({
      imports: [UserComponent], // Standalone-Komponente
      providers: [
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: Firestore, useValue: firestoreStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and process user data on ngOnInit', () => {
    // Fake-Daten, wie sie von Firestore kommen könnten
    const fakeUserData = [
      { id: '1', lastName: 'Doe', birthDate: { seconds: 1234567890 } },
      { id: '2', lastName: 'Smith', birthDate: { seconds: 987654321 } }
    ];

    // Fake-Objekte für collection und query, als any gecastet
    const fakeCollection = {} as any;
    const fakeQuery = {} as any;

    // Spione für die Firestore-Funktionen; die Rückgabewerte werden als any gecastet
    spyOn(FirestoreFns, 'collection').and.returnValue(fakeCollection);
    spyOn(FirestoreFns, 'query').and.returnValue(fakeQuery);
    spyOn(FirestoreFns, 'collectionData').and.returnValue(of(fakeUserData));

    // Aufruf von ngOnInit, der die Fake-Daten verwenden soll
    component.ngOnInit();
    fixture.detectChanges();

    // Überprüfen, ob die Firestore-Funktionen mit den erwarteten Parametern aufgerufen wurden
    expect(FirestoreFns.collection).toHaveBeenCalledWith(component.firestore as any, 'users');
    expect(FirestoreFns.query).toHaveBeenCalledWith(fakeCollection, jasmine.anything());
    expect(FirestoreFns.collectionData).toHaveBeenCalledWith(fakeQuery, { idField: 'id' } as any);

    // Überprüfen, ob allUsers korrekt aktualisiert wurde und ob birthDate konvertiert wurde
    expect(component.allUsers.length).toBe(2);
    expect(component.allUsers[0].id).toBe('1');
    expect(component.allUsers[0].birthDate instanceof Date).toBeTrue();
    expect(component.allUsers[0].birthDate.getTime()).toBe(1234567890 * 1000);
  });

  it('should open dialog when openDialog is called', () => {
    component.openDialog();
    expect(matDialogSpy.open).toHaveBeenCalledWith(DialogAddUserComponent);
  });
});