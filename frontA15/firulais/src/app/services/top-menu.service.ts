import { Injectable } from '@angular/core';
export interface iTopMenu {
  title: string,
  link: string | string[],
  fragment?: string,
  roles?: string[],
  hidden?: boolean,
  state?:any
}

@Injectable({
  providedIn: 'root'
})
export class TopMenuService {

  constructor() { }
}
