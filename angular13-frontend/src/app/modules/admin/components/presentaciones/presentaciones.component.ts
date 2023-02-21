import { Component, OnInit } from '@angular/core';
interface IItemObject {
  id: number;
  name: string;
  file: string;
}
@Component({
  selector: 'app-presentaciones',
  templateUrl: './presentaciones.component.html',
  styleUrls: ['./presentaciones.component.css']
})
export class PresentacionesComponent implements OnInit {
  itemObjectsLeft: IItemObject[] = [
    { id: 1, name: 'Windstorm', file: 'mabricante' },
    { id: 2, name: 'Bombasto', file: 'marca' },
    { id: 3, name: 'Magneta', file: 'especie' }
  ];

  itemObjectsRight: IItemObject[] = [
    { id: 4, name: 'Tornado', file: 'talla' },
    { id: 5, name: 'Mr. O', file: 'rubro' },
    { id: 6, name: 'Tomato', file: 'linea' }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
