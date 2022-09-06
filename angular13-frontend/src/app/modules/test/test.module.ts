import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestComponent } from './test.component';
import { Test2Component } from './components/test2/test2.component';
import { Test1Component } from './components/test1/test1.component';



@NgModule({
  declarations: [
    TestComponent,
    Test2Component,
    Test1Component
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TestComponent,
  ]
})
export class TestModule { }
