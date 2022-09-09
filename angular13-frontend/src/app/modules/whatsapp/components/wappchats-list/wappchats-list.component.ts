import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-wappchats-list',
  templateUrl: './wappchats-list.component.html',
  styleUrls: ['./wappchats-list.component.css']
})
export class WappchatsListComponent implements OnInit {
  @Input() chat:any;
  

  constructor() { }

  ngOnInit(): void {
  }

}
