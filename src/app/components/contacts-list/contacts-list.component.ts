import {Component, inject, OnInit} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
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
  private router = inject(Router);
  contacts: ContactUser[] = [];

  constructor(private dialog: MatDialog, private contactService: ContactService) {}

  ngOnInit() {
    this.contacts = this.contactService.getContacts();
  }

  openContactDetail(contact: ContactUser): void {
    this.router.navigate(['/contacts', contact.id]);
  }

  openAddContactForm() {
    const dialogRef = this.dialog.open(ContactFormComponent, {
      width: '400px',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '300ms',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.contacts = this.contactService.getContacts();
    });
  }

  deleteContact(contactId: number) {
    this.contacts = this.contactService.deleteContact(contactId); // Видаляємо через сервіс
  }
}
