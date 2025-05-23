import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { DataService, Item } from '../services/data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  items: Item[] = [];

  constructor(
    public router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.dataService.currentItems.subscribe(items => {
      this.items = items;
    });
  }

  async editItem(index: number) {
    const item = this.items[index];
    
    const alert = await this.alertController.create({
      header: 'Edit Item',
      inputs: [
        {
          name: 'itemName',
          type: 'text',
          value: item.itemName,
          placeholder: 'Item Name'
        },
        {
          name: 'itemGroup',
          type: 'text',
          value: item.itemGroup,
          placeholder: 'Item Group'
        },
        {
          name: 'id',
          type: 'text',
          value: item.id,
          placeholder: 'ID'
        }
      ],
      buttons: [
        
        {
          text: 'Enable',
          handler: (data) => {
            this.updateItem(index, data, 'Enabled');
          }
        },
        {
          text: 'Disable',
          handler: (data) => {
            this.updateItem(index, data, 'Disabled');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        },
      ]
    });

    await alert.present();
  }

  async updateItem(index: number, data: any, status: string) {
    if (!data.itemName || !data.itemGroup || !data.id) {
      const toast = await this.toastController.create({
        message: 'All fields are required',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });
      toast.present();
      return;
    }

    const updatedItem: Item = {
      itemName: data.itemName,
      itemGroup: data.itemGroup,
      id: data.id,
      status: status
    };

    this.dataService.updateItem(index, updatedItem);

    const toast = await this.toastController.create({
      message: 'Item updated successfully!',
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    toast.present();
  }

  async confirmDelete(index: number) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this item?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteItem(index);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteItem(index: number) {
    this.dataService.deleteItem(index);
    
    const toast = await this.toastController.create({
      message: 'Item deleted successfully!',
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    toast.present();
  }
}
