import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
declare var $
@Component({
  selector: 'app-platform-data-definition',
  templateUrl: './platform-data-definition.component.html',
  styleUrls: ['./platform-data-definition.component.css']
})
export class PlatformDataDefinitionComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    //this.router.navigate(['/platformdefinition/journal']);
    
  }

}
