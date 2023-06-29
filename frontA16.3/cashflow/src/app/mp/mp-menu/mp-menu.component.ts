import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgbNav, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mp-menu',
  standalone: true,
  imports: [
    CommonModule,
    NgbNavModule,
    RouterModule
  ],
  templateUrl: './mp-menu.component.html',
  styleUrls: ['./mp-menu.component.css']
})
export class MpMenuComponent {
  route = inject(ActivatedRoute);
  @Input() links!:any;

}
