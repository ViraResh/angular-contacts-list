import { Injectable } from '@angular/core';
import {ContactUser} from "../models/contact-user.interface";

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private defaultContacts: ContactUser[] = [
    {
      id: 1,
      name: 'Emma Smith',
      image: 'assets/avatar1.png',
      birthDate: 'Jan 1, 2000',
      address: 'Nulla vel metus 15/178',
      email: 'example@email.com',
      phone: '(123) 888 777 632',
    },
    {
      id: 2,
      name: 'John Doe',
      image: 'assets/avatar2.png',
      birthDate: 'Jan 2, 2024',
      address: 'Lorem ipsum 10/3',
      email: 'john@example.com',
      phone: '(321) 555 123 456',
    },
  ];

  private storageKey = 'contacts';

  constructor() {}

  getContacts(): any[] {
    const storedContacts = localStorage.getItem(this.storageKey);

    if (storedContacts) {
      return JSON.parse(storedContacts);
    } else {
      localStorage.setItem(this.storageKey, JSON.stringify(this.defaultContacts));
      return this.defaultContacts;
    }
  }
  getContactById(id: number) {
    const contacts = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    return contacts.find((contact:ContactUser) => contact.id === id);
  }
  saveContacts(contacts: ContactUser[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(contacts));
  }

  addContact(contact: any): any[] {
    const contacts = this.getContacts();
    contact.id = this.generateId();
    contacts.push(contact);
    this.saveContacts(contacts);
    return contacts;
  }

  private generateId(): number {
    const contacts = this.getContacts();
    return contacts.length ? contacts[contacts.length - 1].id + 1 : 1;
  }

  deleteContact(contactId: number): any[] {
    const contacts = this.getContacts().filter(contact => contact.id !== contactId);
    this.saveContacts(contacts);
    return contacts;
  }

  updateContact(updatedContact: ContactUser): ContactUser[] {
    const contacts: ContactUser[] = this.getContacts();
    const index: number = contacts.findIndex((contact: ContactUser) => contact.id === updatedContact.id);

    if (index !== -1) {
      contacts[index] = updatedContact;
      this.saveContacts(contacts);
    }

    return contacts;
  }

}
