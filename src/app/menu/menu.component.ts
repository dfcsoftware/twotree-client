import { Component,
         OnInit
} from '@angular/core';

//import { Observable ,  Subscription } from 'rxjs';
//import 'rxjs/Rx';
//import { merge, of, fromEvent } from 'rxjs/add/observable/merge';
//import 'rxjs/add/observable/merge';
//----------------------------------------------------------------------------//
//   M E N U
//----------------------------------------------------------------------------//
import {MenuDataService
} from './menu-data.service';

//declare var browser = navigator;

@Component({
  selector: 'app-menu',
  providers: [MenuDataService],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  //online = navigator.onLine;
  isConnected: boolean = true;//Observable<boolean>;

  constructor(public menuDataService: MenuDataService) {
    //console.log("MENU:",menuDataService.menu_ba);
      //this.isConnected = Observable.merge(
      //Observable.of(navigator.onLine),
      //Observable.fromEvent(window, 'online').map(() => true),
      //Observable.fromEvent(window, 'offline').map(() => false));
  }

  ngOnInit() {
    //this.menuDataService.getBusinessAreasDemo();
    this.menuDataService.getBusinessAreas();
  }

}
