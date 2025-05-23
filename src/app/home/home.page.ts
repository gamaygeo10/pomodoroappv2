import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { DataService, Item } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  itemName = '';
  status = 'Enabled';
  itemGroup = '';
  id = '';
  items: Item[] = [];

  constructor(
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.dataService.currentItems.subscribe(items => {
      this.items = items;
    });
  }

  async addItem() {
    if (!this.itemName || !this.status || !this.itemGroup || !this.id) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Please fill all fields',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const newItem: Item = {
      itemName: this.itemName,
      status: this.status,
      itemGroup: this.itemGroup,
      id: this.id,
    };

    this.dataService.addItem(newItem);

    const toast = await this.toastController.create({
      message: 'Item added successfully!',
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    toast.present();

    this.itemName = '';
    this.status = 'Enabled';
    this.itemGroup = '';
    this.id = '';

    this.router.navigate(['/profile']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
