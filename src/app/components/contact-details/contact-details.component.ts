import {Component, inject, Inject, OnInit} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardTitle} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {ActivatedRoute, Router} from "@angular/router";
import {ContactService} from "../../services/contact.service";

@Component({
  selector: 'app-contact-details',
  standalone: true,
  imports: [
    MatCard,
    MatIcon,
    NgForOf,
    MatDialogContent,
    MatDialogTitle,
    NgIf,
    MatDialogActions,
    MatButton,
    DatePipe,
    MatCardTitle,
    MatCardContent,
    MatCardActions
  ],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss'
})
export class ContactDetailsComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contactService = inject(ContactService);

  contact: any;

  ngOnInit(): void {
    const contactId = +this.route.snapshot.paramMap.get('id')!;
    if (contactId) {
      this.loadContactDetails(contactId);
    }
  }

  loadContactDetails(id: number): void {
    this.contact = this.contactService.getContactById(id);

    if (!this.contact) {
      console.error(`Contact with ID ${id} not found!`);
    }
  }
  goBack(): void {
    this.router.navigate(['/contacts']);
  }
}
