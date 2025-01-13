import { Injectable } from '@angular/core';

import { ContactUser } from '../models/contact-user.interface';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private defaultContacts: ContactUser[] = [
    {
      id: 1,
      name: 'Emma Smith',
      image: 'assets/avatar1.png',
      birthDate: new Date('2000-01-01'),
      address: 'Nulla vel metus 15/178',
      email: 'example@email.com',
      phone: '(123) 888 777 632',
    },
    {
      id: 2,
      name: 'John Doe',
      image: 'assets/avatar2.png',
      birthDate: new Date('2001-02-01'),
      address: 'Lorem ipsum 10/3',
      email: 'john@example.com',
      phone: '(321) 555 123 456',
    },
  ];

  private storageKey: string = 'contacts';

  getContacts(): any[] {
    const storedContacts: string | null = localStorage.getItem(this.storageKey);

    if (storedContacts) {
      return JSON.parse(storedContacts);
    } else {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify(this.defaultContacts),
      );
      return this.defaultContacts;
    }
  }

  getContactById(id: number): ContactUser {
    const contacts = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    return contacts.find((contact: ContactUser) => contact.id === id);
  }

  saveContacts(contacts: ContactUser[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(contacts));
  }

  addContact(contact: ContactUser): ContactUser[] {
    const contacts: ContactUser[] = this.getContacts();
    contact.id = this.generateId();
    contacts.push(contact);
    this.saveContacts(contacts);

    return contacts;
  }

  private generateId(): number {
    const contacts: ContactUser[] = this.getContacts();

    return contacts.length ? contacts[contacts.length - 1].id + 1 : 1;
  }

  deleteContact(contactId: number): ContactUser[] {
    const contacts: ContactUser[] = this.getContacts().filter(
      (contact: ContactUser) => contact.id !== contactId,
    );
    this.saveContacts(contacts);

    return contacts;
  }

  updateContact(updatedContact: ContactUser): ContactUser[] {
    const contacts: ContactUser[] = this.getContacts();
    const index: number = contacts.findIndex(
      (contact: ContactUser) => contact.id === updatedContact.id,
    );

    if (index !== -1) {
      contacts[index] = updatedContact;
      this.saveContacts(contacts);
    }

    return contacts;
  }
}
