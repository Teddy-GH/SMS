import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'tps-admin-layout',
  templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent implements OnInit {
  mode = false;
  dark = false;
  constructor(private readonly router: Router) {}

  routeTo = true;

  ngOnInit(): void {}

  menuPicker(routeTo: string): any {
    this.routeTo = !this.routeTo;
  }
}
