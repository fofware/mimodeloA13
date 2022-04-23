import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  constructor(
    //private spinner: NgxSpinnerService, 
    private api: ApiService,
    private toastr: ToastrService
    ) { }
  async ngOnInit() {
    //this.socket.on('server:productoPrecio', (data:any) => { console.log(data)});

  }
}
