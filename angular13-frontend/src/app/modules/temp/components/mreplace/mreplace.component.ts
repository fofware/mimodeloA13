import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-mreplace',
  templateUrl: './mreplace.component.html',
  styleUrls: ['./mreplace.component.css']
})
export class MreplaceComponent implements OnInit {
  data:any = {};
  names:string[] = [];

  constructor(
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.api.get('/import/fulldata').subscribe((data:any) => {
      console.log(data);
      this.data = data;
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          this.names.push(data[key])
        }
      }
      console.log(this.names)
    });
  }

  readData(name:string){
    return this.data[`${name}`];
  }
}
