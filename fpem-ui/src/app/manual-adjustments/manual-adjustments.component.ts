import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
declare var $;

@Component({
  selector: 'app-manual-adjustments',
  templateUrl: './manual-adjustments.component.html',
  styleUrls: ['./manual-adjustments.component.css']
})
export class ManualAdjustmentsComponent implements OnInit {

  constructor(private router: Router) { }
  ngOnInit() {
    // this.router.navigate(['/adjustment/manual-upload']);
    
  }
}
