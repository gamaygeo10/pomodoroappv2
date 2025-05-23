import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Item {
  itemName: string;
  status: string;
  itemGroup: string;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiKey = '92b8eab54f7a41cfa9aabb2bfe34c3dd';
  private apiSecret = 'cfb92efb9b8a4d71b8475e038b79da68';
  private baseUrl = 'https://usjrr.erpnext.com/app/item?disabled=0';
  private itemsSource = new BehaviorSubject<Item[]>([]);
  currentItems = this.itemsSource.asObservable();

  private getHeaders() {
    return {
      'Authorization': `token ${this.apiKey}:${this.apiSecret}`,
      'Content-Type': 'application/json'
    };
  }


  constructor() {
    this.loadItems();
  }

  updateItems(items: Item[]) {
    this.itemsSource.next(items);
    localStorage.setItem('items', JSON.stringify(items));
  }

  addItem(item: Item) {
    const currentItems = this.itemsSource.value;
    const updatedItems = [...currentItems, item];
    this.updateItems(updatedItems);
    return updatedItems;
  }

  deleteItem(index: number) {
    const currentItems = this.itemsSource.value;
    const updatedItems = [...currentItems];
    updatedItems.splice(index, 1);
    this.updateItems(updatedItems);
    return updatedItems;
  }

  updateItem(index: number, updatedItem: Item) {
    const currentItems = this.itemsSource.value;
    const updatedItems = [...currentItems];
    updatedItems[index] = updatedItem;
    this.updateItems(updatedItems);
    return updatedItems;
  }

  private loadItems() {
    const storedItems = localStorage.getItem('items');
    if (storedItems) {
      this.itemsSource.next(JSON.parse(storedItems));
    }
  }
}