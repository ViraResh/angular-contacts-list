import {Component, inject, OnInit} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {NgForOf, NgIf} from "@angular/common";
import {MatDialog, MatDialogContainer} from "@angular/material/dialog";
import {MatCard, MatCardActions, MatCardContent, MatCardTitle} from "@angular/material/card";
import {ContactFormComponent} from "../contact-form/contact-form.component";
import {ContactService} from "../../services/contact.service";
import {ContactUser} from "../../models/contact-user.interface";
import {Router} from "@angular/router";
import {debounceTime, distinctUntilChanged, Observable, of, switchMap} from "rxjs";

@Component({
  selector: 'app-contacts-list',
  standalone: true,
  templateUrl: './contacts-list.component.html',
  styleUrls: ['./contacts-list.component.scss'],
  imports: [
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    MatDialogContainer,
    MatCardContent,
    MatCard,
    MatCardTitle,
    MatCardActions,
  ]
})
export class ContactsListComponent implements OnInit {
  searchControl: FormControl<string | null> = new FormControl('');
  filteredContacts: ContactUser[] = [];
  contacts: ContactUser[] = [];
  private router: Router = inject(Router);
  private readonly modalWidth = '400px';
  private readonly enterAnimationDuration = '500ms';
  private readonly exitAnimationDuration = '300ms';

  constructor(
    private dialog: MatDialog,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    this.contacts = this.contactService.getContacts();

    this.triggerSearch();
  }

  openContactDetail(contact: ContactUser): void {
    this.router.navigate(['/contacts', contact.id]);
  }

  openEditContactForm(event: Event, contact: ContactUser): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(ContactFormComponent, {
      width: this.modalWidth,
      data: {
        contact: contact || null,
        isEditing: !!contact,
      },
      enterAnimationDuration: this.enterAnimationDuration,
      exitAnimationDuration: this.exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.contacts = this.contactService.getContacts();
    });

    console.log('openEditContactForm: ', !!contact);
  }

  openAddContactForm(): void {
    const dialogRef = this.dialog.open(ContactFormComponent, {
      width: this.modalWidth,
      enterAnimationDuration: this.enterAnimationDuration,
      exitAnimationDuration: this.exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.contacts = this.contactService.getContacts();
    });
  }

  deleteContact(contactId: number): void {
    this.contacts = this.contactService.deleteContact(contactId);
  }

  onSearchClick(): void {
    const searchTerm: string | null = this.searchControl.value;
    this.searchContacts(searchTerm!).subscribe((result: ContactUser[]) => {
      this.filteredContacts = result;
    });
  }

  private triggerSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((searchTerm: string | null) => this.searchContacts(searchTerm!))
      )
      .subscribe((result: ContactUser[]) => {
        this.filteredContacts = result;
      });

    this.filteredContacts = [...this.contacts];
  }

  private searchContacts(searchTerm: string): Observable<ContactUser[]> {
    if (!searchTerm.trim()) {
      return of([...this.contacts]);
    }

    const lowerCaseTerm: string = searchTerm.toLowerCase();
    const filtered: ContactUser[] = this.contacts.filter(
      (contact: ContactUser) => contact.name.toLowerCase().includes(lowerCaseTerm)
    );
    return of(filtered);
  }
}
