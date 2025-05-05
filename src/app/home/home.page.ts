import { Component, OnInit } from '@angular/core';
import { Platform, IonRouterOutlet } from '@ionic/angular';
import { App } from '@capacitor/app';
import { NotificationService } from '../services/notification.service';
import { getDefaultTimezone, formatDateInTimezone } from '../utils/timezone-util';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  currentTime: string = '';
  countdownTime: string = '';
  sessionType: 'work' | 'break' | null = null;
  isRunning = false;
  remaining: number = 0;
  timer: any;
  private currentTimeInterval: any;

  constructor(
    private platform: Platform,
    private notificationService: NotificationService,
    private routerOutlet: IonRouterOutlet
  ) {
    // Handle back button
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
        App.minimizeApp(); // minimize instead of exiting
      }
    });
  }

  ngOnInit(): void {
    this.notificationService.listenForIncomingNotifications();

    // Start updating current time
    this.currentTimeInterval = setInterval(() => {
      const now = new Date();
      const defaultTimezone = getDefaultTimezone();
      this.currentTime = formatDateInTimezone(now, defaultTimezone);
    }, 1000);
  }

  ionViewWillLeave() {
    if (this.currentTimeInterval) {
      clearInterval(this.currentTimeInterval);
    }
  }

  startPomodoro() {
    if (this.isRunning) return;

    if (this.timer) {
      clearInterval(this.timer);
    }

    this.sessionType = 'work';
    this.remaining = 5 * 1; // 5 seconds for quick testing, you can make it 25 * 60 for real Pomodoro
    this.runTimer();
  }

  updateCountdown() {
    const mins = Math.floor(this.remaining / 60).toString().padStart(2, '0');
    const secs = (this.remaining % 60).toString().padStart(2, '0');
    this.countdownTime = `${mins}:${secs}`;
  }

  runTimer() {
    this.isRunning = true;
    this.updateCountdown();

    this.timer = setInterval(async () => {
      this.remaining--;
      this.updateCountdown();

      if (this.remaining <= 0) {
        clearInterval(this.timer);

        // Notify the user when session ends using NotificationService
        const message = this.sessionType === 'work'
          ? 'Work session over! Take a break.'
          : 'Break over! Time to work.';

        await this.createEndOfSessionNotification(message);

        if (this.sessionType === 'work') {
          // Start break session
          this.sessionType = 'break';
          this.remaining = 5 * 60; // 5 minutes break
          this.runTimer();
        } else {
          // Reset after break
          this.reset();
        }
      }
    }, 1000);
  }

  async createEndOfSessionNotification(message: string) {
    const notification: any = {
      title: 'Pomodoro Timer',
      body: message,
      id: new Date().getTime(), // Unique ID for each notification
      sound: null,
      attachments: null,
      actionTypeId: '',
      extra: null,
    };
  
    const permissions = await this.notificationService.checkNotificationPermissions();
    if (permissions.display !== 'granted') {
      await this.notificationService.requestNotificationPermissions();
    }
  
    await this.notificationService.scheduleNotification(notification);
  }

  reset() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.isRunning = false;
    this.sessionType = null;
    this.countdownTime = '';
    this.remaining = 0;
  }
}
