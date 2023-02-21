import { Component, inject, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ApiService } from 'src/app/services/api.service';
import { SlideArticuloCardComponent } from '../slide-articulo-card/slide-articulo-card.component';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgFor,
    CarouselModule,
    SlideArticuloCardComponent,
    NgbTooltip
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  data: any = [];
  searchItem='';
  limit = 10;
  count = 0;
  offset = 0;
  nextOffset: number | boolean = 0;
  loading = false;
  auth = inject(AuthService);
  private api = inject(ApiService);

  ngOnInit(): void {
    this.searchData();
    console.log(this.auth.userValue)
  }

  setData(){
    if(this.loading) return;
    if(this.nextOffset === false) return;
    this.loading = true;

    const params = {
      pVenta: true,
      limit: this.limit,
      offset: this.nextOffset,
      searchItem: this.searchItem,
      //sort: {'marca':1, 'especie': 1, 'edad': 1, 'name': 1, 'raza': 1 }
    };

    this.api.post('/articulos/public',params, {spinner: 'true'}).subscribe((data:any) => {
      console.log(data);
      this.loading = false;
      this.count = data.count;
      this.offset = data.offset;
      this.nextOffset = data.nextOffset;
      //data.rows.map((reg:any) => { this.makeFullName(reg); })
      this.data = this.data.concat(data.rows);
    });
  }

  searchData(){
    this.nextOffset = 0;
    this.count = 0;
    this.data = [];
    this.setData();
  }

  log(event:number){
    if( this.nextOffset )
      if( event > this.data.length-5) this.setData();
  }

}
