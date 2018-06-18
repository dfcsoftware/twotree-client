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

@Component({
  selector: 'app-page',
  providers: [PageDataService],
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {
  ifEdit      : boolean = false;
  pageHistory : Array<string>;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
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

  } // ngOnInit

  public ngOnDestroy() {

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

  pageUp(index) {
    this.pageDataService.pageUP(index);
  } // pageUP

  pageDown(index) {
    this.pageDataService.pageDOWN(index);
  } // pageUP

  articleUp(index) {
    this.pageDataService.articleUP(index);
  } // articleUP

  articleDown(index) {
    this.pageDataService.articleDOWN(index);
  } // articleUP

  pageEdit(pageID: string, pageName: string) {
    console.log("PAGE: redirect /pageEdit/",pageID);
    this.router.navigate(['/pageEdit/'+pageID], { queryParams: { p: pageName}, queryParamsHandling: 'merge' });
    //this.router.navigate(['/pageEdit/'+pageID+'?p='+pageName]);
  } // redirect

}
