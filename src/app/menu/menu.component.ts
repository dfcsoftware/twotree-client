import { Component,
         OnInit
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/Rx';
//----------------------------------------------------------------------------//
//   M E N U
//----------------------------------------------------------------------------//
import {MenuDataService
} from './menu-data.service';

@Component({
  selector: 'app-menu',
  providers: [MenuDataService],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  //online = navigator.onLine;
  isConnected: Observable<boolean>;

  constructor(public menuDataService: MenuDataService) {
    //console.log("MENU:",menuDataService.menu_ba);
      this.isConnected = Observable.merge(
      Observable.of(navigator.onLine),
      Observable.fromEvent(window, 'online').map(() => true),
      Observable.fromEvent(window, 'offline').map(() => false));
  }

  ngOnInit() {
    //this.menuDataService.getBusinessAreasDemo();
    this.menuDataService.getBusinessAreas();
  }

}
