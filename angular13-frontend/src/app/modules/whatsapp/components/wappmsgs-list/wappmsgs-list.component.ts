import { Component, OnInit } from '@angular/core';
import { WappService } from '../../services/wapp.service';

@Component({
  selector: 'app-wappmsgs-list',
  templateUrl: './wappmsgs-list.component.html',
  styleUrls: ['./wappmsgs-list.component.css']
})
export class WappmsgsListComponent implements OnInit {

  constructor(msgservice: WappService) { }

  ngOnInit(): void {
  }

}
