import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  data:any = inject(ActivatedRoute).snapshot.data;
  @Input({required: true}) contact!: string;
  ngOnInit(): void {
    console.log(this.data)
  }

}
