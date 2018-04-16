import { Component, OnInit
} from '@angular/core';

import { ActivatedRoute
} from '@angular/router';

import {Location
} from "@angular/common";

import {Router
} from '@angular/router';

import {PageDataService
} from './page-data.service';

import {MenuDataService
} from '../menu/menu-data.service';

import { pageItem
} from './page.model';

import { AuthService
} from '../auth.service';

import  {
  DragulaService
} from 'ng2-dragula';

@Component({
  selector: 'app-page',
  providers: [PageDataService],
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {
  ifEdit      : boolean = false;
  ifLoggedIn  : boolean = false;
  pageHistory : Array<string>;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private dragulaService: DragulaService,
              public authService: AuthService,
              public pageDataService: PageDataService,
              public menuDataService: MenuDataService) {

    //this.pageDataService.getpageDatasDemo_server();
    var url = activatedRoute.snapshot.url[1].path;
    var parent_url = menuDataService.getFunkRoute(url);
    console.log("PAGE parent_url:",parent_url);
    // put rslt into seg-zero pageHistory
    this.pageHistory = [parent_url];
    this.showPage(url);
  } // constructor

  ngOnInit() {
    // Dragula
    this.dragulaService.setOptions('item-bag', {
      revertOnSpill: true,
      moves: function (el:any, container:any, handle:any):any {
        console.log("PAGE: dragulaService moves requseted for - ",el);
        //return handle.classList.contains('movehandle');
        return handle.classList.contains('movehandle');
      }
    });
    this.dragulaService.drop.subscribe((value:any) => {
      console.log(`PAGE: drop.subscribe: ${value[0]}`);
      //console.log(value);
      this.onDrop(value.slice(1));
    });
    /*
    dragulaService.drag.subscribe((value) => {
          console.log(`drag: ${value[0]}`);
          console.log(value);
          this.onDrag(value.slice(1));
        });
    // dropModel will automatically sync the page_items array with DOM
    //  we want to sync the backend, so we will sync array & DOM ourselves
    dragulaService.dropModel.subscribe((value) => {
          console.log(`drop: ${value[0]}`);
          console.log(value);
          this.onDrop(value.slice(1));
        });
    dragulaService.over.subscribe((value) => {
          console.log(`over: ${value[0]}`);
          console.log(value);
          this.onOver(value.slice(1));
        });
    dragulaService.out.subscribe((value) => {
          console.log(`out: ${value[0]}`);
          console.log(value);
          this.onOut(value.slice(1));
        });
    */
  } // ngOnInit

  public ngOnDestroy() {
   if (this.dragulaService.find('item-bag') !== undefined) {
    this.dragulaService.destroy('item-bag');
   }
  } // ngOnDestroy

  editMode() {
    this.ifEdit = !this.ifEdit;
  } // editMode

  setHistory(url : string) {
    var stateObj = { pageId: url};
    history.pushState(stateObj, url, "/twotree/page/"+url); //change browser url
    this.pageHistory.push(url);
  } // setHistory

  goBack(){
    console.log("PAGE-pageHistory",this.pageHistory);
    this.pageHistory.pop(); // pop current location
    var url = this.pageHistory.pop(); // use prior location
    if (this.pageHistory.length == 0) {
      console.log("PAGE-pageHistory-> navigate to funktion:",url);
      this.router.navigate([url]);
    } else {
      this.showPage(url);
    }
  } // goBack

  showPage(url : string ) {
    console.log("PAGE: getPage", url);
    this.setHistory(url);
    console.log("PAGE-h:",this.pageHistory);
    this.pageDataService.getPage(url);
  } // showPage

  // Dragula
  private onDrag(args) {
    let [e, el] = args;
    // do something
    //console.log('onDrag');
    //console.log(args);
  } // onDrag

    move (data, pos1, pos2): Array<pageItem> {
      // local variables
      var i, tmp;
      var newData = data.slice(0);
      // cast input parameters to integers
      pos1 = parseInt(pos1, 10);
      pos2 = parseInt(pos2, 10);
      // if positions are different and inside array
      if (pos1 !== pos2 &&
          0 <= pos1 && pos1 <= data.length &&
          0 <= pos2 && pos2 <= data.length) {
          console.log("PAGE: move array b4 mv");
          console.table(newData);
          // save element from position 1
          tmp = newData[pos1];
          console.log(tmp);
          // move element down and shift other elements up
          if (pos1 < pos2) {
              console.log('PAGE: move array down');
              for (i = pos1; i < pos2; i++) {
                  //console.log(newData[i] ,newData[i + 1] );
                  newData[i] = newData[i + 1];
              }
          }
          // move element up and shift other elements down
          else {
              console.log('PAGE: move array up');
              for (i = pos1; i > pos2; i--) {
                  newData[i] = newData[i - 1];
              }
          }
          // put element from position 1 to destination
          newData[pos2] = tmp;
      }
      console.log("PAGE: move after array move - ",newData);
      //
      this.move_items(pos1,pos2);
      return newData;
  } // move

  move_items(pos1, pos2){
    console.debug('PAGE: move_items in DB for '+this.pageDataService.pageID+'-> '+pos1+' to '+pos2);
    this.pageDataService.moveItemData(this.pageDataService.pageID, pos1, pos2)
  } // move_items

  private onDrop(args) {
    let [ el, target, source, sibling] = args;
    /* el, target, source, sibling */
    /* el was dropped into target before a sibling element, and originally came from source */
    /* https://github.com/bevacqua/dragula#readme see drake.on (Events) */
    console.log('PAGE: onDrop - ',args);
    //
    let mvOne = 0;
    let mvTwo = 0;
    let lis   = target.getElementsByTagName("li");
    console.log("PAGE: onDrop el:",el.firstElementChild.id);
    if (! sibling) { // destination at end of array
      /* if sib is null then (down & move el to lis.length-1) */
      //console.log("PAGE: onDrop down");
      //console.log("PAGE: sib:",lis.length);
      mvOne=el.firstElementChild.id;
      mvTwo=lis.length-1;
      console.log("PAGE: onDrop move item down -> ",mvOne,mvTwo);
    } else {
      //console.log("PAGE: sib:",sibling.firstElementChild.id);
      /* if el < sib then (down & move el to sib-1) */
      if ( el.firstElementChild.id < sibling.firstElementChild.id ) {
        //console.log("PAGE: onDrop down");
        mvOne=el.firstElementChild.id ;
        mvTwo=sibling.firstElementChild.id-1;
        console.log("PAGE: onDrop move item down -> ",mvOne,mvTwo);
      } else {
      /* if el > sib then (up  & move el to sib) */
        //console.log("PAGE: onDrop up");
        mvOne=el.firstElementChild.id ;
        mvTwo=sibling.firstElementChild.id;
        console.log("PAGE: onDrop move item up -> ",mvOne,mvTwo);
      }
    }
    //
    this.pageDataService.page_items = this.move (this.pageDataService.page_items,
                  mvOne,
                  mvTwo).slice(0);
    //
    console.group("PAGE: onDrop Move results for ",this.pageDataService.pageID);
    console.table(this.pageDataService.page_items);
    console.groupEnd();
  } // onDrop

  private onOver(args) {
    let [e, el, container] = args;
    // do something
  } // onOver

  private onOut(args) {
    let [e, el, container] = args;
    // do something
  }  // onOut
}
