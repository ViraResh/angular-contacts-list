import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

import { ContactService } from '../../services/contact.service';
import { ContactUser } from '../../models/contact-user.interface';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    MatDialogTitle,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    NgIf,
    MatDialogActions,
    MatInputModule,
    MatButton,
    MatFormFieldModule,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
})
export class ContactFormComponent {
  contactForm: FormGroup;
  imagePreview: string | null = null;
  isEditing: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { contact: ContactUser | null; isEditing: boolean },
    public dialogRef: MatDialogRef<ContactFormComponent>,
    private fb: FormBuilder,
    private contactService: ContactService,
  ) {
    this.contactForm = this.fb.group({
      name: [data?.contact?.name || '', Validators.required],
      email: [
        data?.contact?.email || '',
        [Validators.required, Validators.email],
      ],
      phone: [
        data?.contact?.phone || '',
        [
          Validators.required,
          Validators.pattern(/^\+?[0-9]{10,15}$/),
        ],
      ],
      address: [data?.contact?.address || ''],
      birthDate: [data?.contact?.birthDate || '', Validators.required],
    });

    this.isEditing = data?.isEditing;
  }

  submitContactForm(): void {
    if (this.contactForm.valid) {
      const newContact = this.contactForm.value;

      if (this.isEditing) {
        const updatedContact = { ...newContact, id: this.data.contact?.id };
        this.contactService.updateContact(updatedContact);
        this.dialogRef.close(updatedContact);
      } else {
        this.contactService.createContact(newContact);
        this.dialogRef.close(newContact);
      }
    }
  }

  cancel(): void {
    this.imagePreview = null;
    this.dialogRef.close();
  }
}
