import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
declare var $
@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    // this.router.navigate(['/controls/activity-dashboard']);
    
  }

}
