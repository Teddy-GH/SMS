import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tps-summary-footer',
  templateUrl: './summary-footer.component.html',
  styleUrls: ['./summary-footer.component.scss']
})
export class SummaryFooterComponent implements OnInit {
  date = new Date();

  ngOnInit(): void {}
}
