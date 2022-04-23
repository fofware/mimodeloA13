import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-htmldata',
  templateUrl: './htmldata.component.html',
  styleUrls: ['./htmldata.component.css']
})
export class HtmldataComponent implements OnInit {
  data:any = []
  constructor(
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.api.leer('/productos/fulldata')
        .subscribe((res: any) => {
          this.data = res;
        });
  }
}
