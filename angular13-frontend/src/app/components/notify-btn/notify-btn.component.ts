import { Component, OnInit } from '@angular/core';
import { Socket2Service } from 'src/app/services/socket.service';

@Component({
  selector: 'app-notify-btn',
  templateUrl: './notify-btn.component.html',
  styleUrls: ['./notify-btn.component.css']
})
export class NotifyBtnComponent implements OnInit {

  constructor(
    //public WAsocket: Socket2Service

  ) { }

  ngOnInit(): void {
  }

}
