import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-testsort',
  templateUrl: './testsort.component.html',
  styleUrls: ['./testsort.component.css']
})
export class TestsortComponent implements OnInit {
  items = [
    {
       id: 1,
       name: 'Apple'
    },
    {
       id: 2,
       name: 'Orange'
    },
    {
       id: 3,
       name: 'Mango'
    }
 ];

  constructor() { }

  ngOnInit(): void {
  }

}
