import { Component, OnInit
} from '@angular/core';

import { ActivatedRoute
} from '@angular/router';

import {MenuDataService
} from '../menu/menu-data.service';

@Component({
  selector: 'app-funk',
  providers: [MenuDataService],
  templateUrl: './funk.component.html',
  styleUrls: ['./funk.component.css']
})
export class FunkComponent implements OnInit {
  funkTitle  : string;
  funkId : string;

  constructor(public menuDataService: MenuDataService,
              private activatedRoute: ActivatedRoute) {
    //console.log("FUNK:",activatedRoute.snapshot.url); // array of states
    //console.log("FUNK:",activatedRoute.snapshot.url[0].path); // place
    this.funkId    = activatedRoute.snapshot.url[0].path.toUpperCase();
    this.funkTitle = activatedRoute.snapshot.url[0].path.charAt(0).toUpperCase()+
                     activatedRoute.snapshot.url[0].path.substring(1);
  }

  ngOnInit() {
    //this.menuDataService.getFunktionsDemo();
    this.menuDataService.getFunktion();
  }

}
