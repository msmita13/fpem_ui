import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
declare var $;
@Component({
  selector: 'app-reference-data',
  templateUrl: './reference-data.component.html',
  styleUrls: ['./reference-data.component.css']
})
export class ReferenceDataComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    
  }

}
