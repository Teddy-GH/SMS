import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tps-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  date = new Date();

  ngOnInit(): void {}
}
