import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public productos = [
    { id:'1', name:"Angular"},
    { id:'2', name:'Pepe'}
  ];
  public product = {id: 'new', name: '' }
  constructor(private router : Router) { }

  ngOnInit(): void {

  }

  gotoDynamic(item:any) {
    //this.router.navigateByUrl('/dynamic', { state: { id:1 , name:'Angular' } });
    console.log(item);
    this.router.navigate(['/proveedores/edit', item] );
  }
}
