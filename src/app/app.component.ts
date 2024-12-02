import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IdleService } from '../service/idle.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ManagerTourVietNam-FE.v1';
  // Thuộc tính cho form
  //constructor(private idleService: IdleService) {}
}
