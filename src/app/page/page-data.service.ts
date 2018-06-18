import { Injectable
} from '@angular/core';

import { TitleCasePipe
} from '@angular/common';

/*
 * 3rd Party
 */
//import '..vendor/Wiky.js';
declare var Wiky: any;
import { toHtml, toWiky
} from '../vendor/Wiky';

import t from 'typy';

/*
 * Twotree
 */
import { pageItem,
         pageDetail,
         pageData,
         pageObject
} from './page.model';

import { DataService, Return, Result, Settings
} from '../data.service';

export interface IPageObjectCallback {
    ( error: Error, result?: Array<pageObject>, ba_id?: string, f_id?:string ) : void;
}

export interface ICallback {
    ( error: Error, result?: string ) : void;
}


@Injectable()
export class PageDataService {
  rslt : Result = new Result();
  pageTitle    : string;
  pageID       : string;
  pageAuth     : number;
  pageObject   : Array<pageObject>;
  activeDetail : boolean = false;
  page_items   : Array<pageItem>;
  page_details : Array<pageDetail>;
  page_html    : Array<pageDetail>;
  page_data    : Array<pageData>;
  public pageItems   : pageItem;
  public pageDetails : pageDetail;
  public pageDatas   : pageData;
  auth_view     : number = 1;

  constructor(private dataService : DataService,
              private titlecasePipe:TitleCasePipe ) {
    this.pageItems   = new pageItem(null);
    this.pageDetails = new pageDetail(null);
    this.pageDatas   = new pageData(null);
    this.pageObject = [{ name : '',
                         value: ''
                      }];
    //console.log(Wiky); // Defined fron index.html <script> tag
  }

  // Simulate GET from network
  getpageDatasDemo_server() {
    this.page_data = this.pageDatas.get_demo();
    //console.log("PageDataService: constructor");
    //console.log(this.page_data);
  }

  assignPage(payload : any, needsConvert : boolean) {
    this.page_data = payload;
    this.pageTitle = this.page_data[0].parent_item;
    this.pageID = this.page_data[0].parent_id;
    this.pageAuth = this.page_data[0].parent_auth_cd;
    console.log("PAGE-DATA: page global",this.pageTitle,this.pageID,this.pageAuth);
    if (this.page_data[0].items) {
     this.page_items = this.page_data[0].items;
     console.log("PAGE-DATA: items",this.page_items);
    }
    if (this.page_data[0].details) {
      this.page_details = this.page_data[0].details;
      this.page_html = this.detailsToHTML(needsConvert);
      console.log("PAGE-DATA: details",this.page_details);
    }
  } // assignPage

  getLocalPage(parent_id : string ) {
    this.dataService.getPageLocal(parent_id)
     .subscribe(
         (val) => {
                 console.log("PAGE-DATA: getPageLocal call successful value returned in body",
                   val);
                  if (val) {
                    this.assignPage(val,false);
                  }
                  this.getHTTPPage(parent_id,true); // refresh local from network
                  },
        response => {
                    console.warn("PAGE-DATA: getPageLocal call in error", response);
                    this.getHTTPPage(parent_id,true); // refresh local from network
                    },
              () => { // localStorage never send this...
                    console.log("PAGE-DATA: The getPageLocal observable is now completed.");
                    }
               )
  }  // getLocalPage

  getHTTPPage(parent_id:string, needsConvert: boolean){
    this.dataService.getPage(parent_id)
        .subscribe(
         (val) => {
             console.log("PAGE-DATA: getPage call successful value returned in body",
                         val);
             this.rslt = this.dataService.check_results(val);
             if (this.rslt.status == Return.http_good ) {
               console.log("PAGE-DATA: getPage ok",this.rslt);
               this.assignPage(this.rslt.payload,needsConvert);
               //console.log("PAGE:",this.dataService.getLocalSettings());
               if (this.dataService.getLocalSettings().saveData) {
                 console.log("PAGE-DATA Saving Page locally");
                 this.dataService.putPageLocal(parent_id,this.page_data);
               }
             } else { // Already tried local database
               console.error("PAGE-DATA: http getPage rslt no good", this.rslt.error);
               //this.getLocalPage(parent_id);
             }
         },
         response => {
             console.error("PAGE-DATA: getPage call in error", response);
             this.rslt = this.dataService.check_error(response);
             console.error('PAGE-DATA: ERROR getPage-> status:',this.rslt.status);
             console.error('PAGE-DATA: ERROR getPage-> message:',this.rslt.error);
             //this.getLocalPage(parent_id); // already tried it
         },
         () => {
             //console.log("The POST observable is now completed.");
        }
      );
  } // getHTTPPage

  //  GET
  getPage(parent_id:string) {
    if (this.dataService.getLocalSettings().saveData) {
      this.getLocalPage(parent_id);
    } else {
      this.getHTTPPage(parent_id,true);
    }
  } // getPage

  detailsToHTML(needsConvert:boolean){
    this.activeDetail = false;
    var page = Array<pageDetail>();
    if ( Array.isArray(this.page_details) ) {
      var arrayLength = this.page_details.length;
      console.log("PAGE-DATA: Page_Detail - length",arrayLength);
      for (var i = 0; i < arrayLength; i++) {
        this.activeDetail = true;
        page.push(this.page_details[i]);
        if (needsConvert) {
          console.log("PAGE-DATA: Page_Detail - converting to Wiky",page);
          page[i].text = this.convertToHtml(this.page_details[i].text);
          console.log("PAGE-DATA: Page_Detail - converted to Wiky",page);
        }
      }
    }
    return page;
  } // detailsToHTML

  convertToHtml(text : string) : string {
     console.log("PAGE-DATA:",Wiky);
     return Wiky.toHtml(text); // defined from index.html
  } // convertToHtml

  convertToWiky(text) : string {
     return Wiky.toWiky(text); // defined from index.html
  } // convertToWiky

  moveItemData(parent_id:string, from_loc:string, to_loc:string) {
    this.dataService.moveItemData(parent_id,from_loc,to_loc).subscribe(
      (results: any) => { // on sucesss
           //this.loading = false;
           this.rslt = this.dataService.check_results(results)
           console.debug('PAGE-DATA: moveItemData rslt:', this.rslt);
           if (this.rslt.status != Return.http_good ) {
               console.error('PAGE-DATA: ERROR moveItemData-> status:',this.rslt.status);
               console.error('PAGE-DATA: ERROR moveItemData-> message:',this.rslt.error);
               //this.app.set_footer('('+rslt.status+')'+rslt.error.message);
           } else {
               console.log("PAGE-DATA: ok ",this.rslt.payload);
               //this.app.set_footer(rslt.payload);
           }
        },
      (err: any) => { // on error
           console.error("PAGE-DATA: moveItemData err ",err);
           //this.loading = false;
        },
      () => { // on completion
           //this.loading = false;
           console.log('PAGE-DATA: completed moveItemData items');
           //this.app.set_footer("(move) completed");
        }
    );
  } // moveItemData

    getObject (parent_id:string,callback:IPageObjectCallback) : void {
      this.dataService.getObject(parent_id)
        .subscribe(
         (val) => {
             console.log("PAGE-DATA: getObject call successful value returned in body",
                         val);
             this.rslt = this.dataService.check_results(val);
             if (this.rslt.status == Return.http_good ) {
               console.log("PAGE-DATA: getObject ok",this.rslt);
               this.pageObject = [];
               let str = { name  : this.titlecasePipe.transform(this.rslt.payload[0].object_id),
                           value : this.rslt.payload[0].object_id
                         };
               this.pageObject.push(str);
               this.getObject2 (this.rslt.payload[0].business_area_id,
                                this.rslt.payload[0].function_id,
                                callback);
             } else { // Already tried local database
               console.error("PAGE-DATA: http getObject rslt no good", this.rslt.error);
               //this.getLocalPage(parent_id);
             }
         },
         response => {
             console.error("PAGE-DATA: getObject call in error", response);
             this.rslt = this.dataService.check_error(response);
             console.error('PAGE-DATA: ERROR getObject-> status:',this.rslt.status);
             console.error('PAGE-DATA: ERROR getObject-> message:',this.rslt.error);
             //this.getLocalPage(parent_id); // already tried it
         },
         () => {
             //console.log("The POST observable is now completed.");
        }
      ); //getObject

	  } // getObject

	  getObject2 (business_area_id:string,function_id:string,callback:IPageObjectCallback) : void {
      this.dataService.getObject2(business_area_id,function_id)
        .subscribe(
         (val) => {
             console.log("PAGE-DATA: getObject2 call successful value returned in body",
                         val);
             this.rslt = this.dataService.check_results(val);
             if (this.rslt.status == Return.http_good ) {
               console.log("PAGE-DATA: getObject2 ok",this.rslt);
               this.pageObject = [];
               for ( var key in this.rslt.payload ) {
                 let str = { name  : this.titlecasePipe.transform(this.rslt.payload[key].object_id),
                             value : this.rslt.payload[key].object_id
                           };
                 this.pageObject.push(str);
                 callback(null, this.pageObject, business_area_id, function_id);
                }

             } else { // Already tried local database
               console.error("PAGE-DATA: http getObject2 rslt no good", this.rslt.error);
               //this.getLocalPage(parent_id);
             }
         },
         response => {
             console.error("PAGE-DATA: getObject2 call in error", response);
             this.rslt = this.dataService.check_error(response);
             console.error('PAGE-DATA: ERROR getObject2-> status:',this.rslt.status);
             console.error('PAGE-DATA: ERROR getObject2-> message:',this.rslt.error);
             //this.getLocalPage(parent_id); // already tried it
         },
         () => {
             //console.log("The POST observable is now completed.");
        }
      );
    } //getObject

    putPage(pagename:string,  page_type:string,        priv:boolean,
            parent_id:string, business_area_id:string, function_id:string,
            callback:ICallback)  {
      this.dataService.putPage(pagename,  page_type,        priv,
                               parent_id, business_area_id, function_id)
        .subscribe(
         (val) => {
             console.log("PAGE-DATA: putPage call successful value returned in body",
                         val);
             this.rslt = this.dataService.check_results(val);
             if (this.rslt.status == Return.http_good ) {
               console.log("PAGE-DATA: putPage ok",this.rslt);
               callback(null, this.rslt.payload);
             } else {
               console.error("PAGE-DATA: http putPage rslt no good", this.rslt.error);
             }
         },
         response => {
             console.error("PAGE-DATA: putPage call in error", response);
             this.rslt = this.dataService.check_error(response);
             console.error('PAGE-DATA: ERROR putPage-> status:',this.rslt.status);
             console.error('PAGE-DATA: ERROR putPage-> message:',this.rslt.error);
         },
         () => {
             //console.log("The POST observable is now completed.");
        }
      );
    } // putPage

    putPageText(pagename:string,  page_type:string,        priv:boolean,
                pageid:string,    business_area_id:string, function_id:string,
                callback:ICallback)  {
      this.dataService.putPageText(pageid, pagename, priv, page_type,
                                   business_area_id, function_id)
        .subscribe(
         (val) => {
             console.log("PAGE-DATA: putPageText call successful value returned in body",
                         val);
             this.rslt = this.dataService.check_results(val);
             if (this.rslt.status == Return.http_good ) {
               console.log("PAGE-DATA: putPageText ok",this.rslt);
               callback(null, this.rslt.payload);
             } else {
               console.error("PAGE-DATA: http putPageText rslt no good", this.rslt.error);
             }
         },
         response => {
             console.error("PAGE-DATA: putPageText call in error", response);
             this.rslt = this.dataService.check_error(response);
             console.error('PAGE-DATA: ERROR putPageText-> status:',this.rslt.status);
             console.error('PAGE-DATA: ERROR putPageText-> message:',this.rslt.error);
         },
         () => {
             //console.log("The POST observable is now completed.");
        }
      );
    } // putPageText

  pageUP(index) {
    if (index <= 0 || index >= this.page_items.length)
            return;
    var temp = this.page_items[index];
    console.log("PAGE-DATA pageUP:",this.page_items[index].id,this.pageID);
		this.dataService.putPageUP(this.page_items[index].id,this.pageID) // DB
        .subscribe(
         (val) => {
             console.log("PAGE-DATA: pageUP call successful value returned in body",
                         val);
             this.rslt = this.dataService.check_results(val);
             if (this.rslt.status == Return.http_good ) {
               console.log("PAGE-DATA: pageUP ok",this.rslt);
             } else {
               console.error("PAGE-DATA: http pageUP rslt no good", this.rslt.error);
             }
         },
         response => {
             console.error("PAGE-DATA: pageUP call in error", response);
             this.rslt = this.dataService.check_error(response);
             console.error('PAGE-DATA: ERROR pageUP-> status:',this.rslt.status);
             console.error('PAGE-DATA: ERROR pageUP-> message:',this.rslt.error);
         },
         () => {
             //console.log("The POST observable is now completed.");
        }
      );
    this.page_items[index] = this.page_items[index - 1];
    this.page_items[index - 1] = temp;
  } // pageUP

  pageDOWN(index) {
    if (index < 0 || index >= (this.page_items.length - 1))
			return;
    var temp = this.page_items[index];
    console.log("PAGE-DATA pageDOWN:",this.page_items[index].id,this.pageID);
		this.dataService.putPageDOWN(this.page_items[index].id,this.pageID) // DB
        .subscribe(
         (val) => {
             console.log("PAGE-DATA: pageDOWN call successful value returned in body",
                         val);
             this.rslt = this.dataService.check_results(val);
             if (this.rslt.status == Return.http_good ) {
               console.log("PAGE-DATA: pageDOWN ok",this.rslt);
             } else {
               console.error("PAGE-DATA: http pageDOWN rslt no good", this.rslt.error);
             }
         },
         response => {
             console.error("PAGE-DATA: pageDOWN call in error", response);
             this.rslt = this.dataService.check_error(response);
             console.error('PAGE-DATA: ERROR pageDOWN-> status:',this.rslt.status);
             console.error('PAGE-DATA: ERROR pageDOWN-> message:',this.rslt.error);
         },
         () => {
             //console.log("The POST observable is now completed.");
        }
      );
    this.page_items[index] = this.page_items[index + 1];
    this.page_items[index + 1] = temp;
  } // pageDOWN

  putArticle(articlename:string, article_type:string,     priv:boolean,
             parent_id:string,   business_area_id:string, function_id:string,
             callback:ICallback)  {
      this.dataService.putArticle(articlename, article_type,     priv,
                                  parent_id,   business_area_id, function_id)
        .subscribe(
         (val) => {
             console.log("PAGE-DATA: putArticle call successful value returned in body",
                         val);
             this.rslt = this.dataService.check_results(val);
             if (this.rslt.status == Return.http_good ) {
               console.log("PAGE-DATA: putArticle ok",this.rslt);
               callback(null, this.rslt.payload);
             } else {
               console.error("PAGE-DATA: http putPage rslt no good", this.rslt.error);
             }
         },
         response => {
             console.error("PAGE-DATA: putArticle call in error", response);
             this.rslt = this.dataService.check_error(response);
             console.error('PAGE-DATA: ERROR putArticle-> status:',this.rslt.status);
             console.error('PAGE-DATA: ERROR putArticle-> message:',this.rslt.error);
         },
         () => {
             //console.log("The POST observable is now completed.");
        }
      );
  } // putArticle

  articleUP(index) {
    if (index <= 0 || index >= this.page_details.length)
            return;
    var temp = this.page_details[index];
    var temp2 = this.page_html[index];
    console.log("PAGE-DATA articleUP:",this.page_details[index].id,this.pageID);
		this.dataService.putArticleUP(this.page_details[index].id,this.pageID) // DB
        .subscribe(
         (val) => {
             console.log("PAGE-DATA: articleUP call successful value returned in body",
                         val);
             this.rslt = this.dataService.check_results(val);
             if (this.rslt.status == Return.http_good ) {
               console.log("PAGE-DATA: articleUP ok",this.rslt);
             } else {
               console.error("PAGE-DATA: http articleUP rslt no good", this.rslt.error);
             }
         },
         response => {
             console.error("PAGE-DATA: articleUP call in error", response);
             this.rslt = this.dataService.check_error(response);
             console.error('PAGE-DATA: ERROR articleUP-> status:',this.rslt.status);
             console.error('PAGE-DATA: ERROR articleUP-> message:',this.rslt.error);
         },
         () => {
             //console.log("The POST observable is now completed.");
        }
      );
    this.page_details[index] = this.page_details[index - 1];
    this.page_details[index - 1] = temp;
    this.page_html[index] = this.page_html[index - 1];
    this.page_html[index - 1] = temp2;
  } // articleUP

  articleDOWN(index) {
  console.log("PAGE-DATA articleDOWN page_details:",this.page_details);
    if (index < 0 || index >= (this.page_details.length - 1))
			return;
    var temp = this.page_details[index];
    var temp2 = this.page_html[index];
    console.log("PAGE-DATA articleDOWN:",this.page_details[index].id,this.pageID);
		this.dataService.putArticleDOWN(this.page_details[index].id,this.pageID) // DB
        .subscribe(
         (val) => {
             console.log("PAGE-DATA: articleDOWN call successful value returned in body",
                         val);
             this.rslt = this.dataService.check_results(val);
             if (this.rslt.status == Return.http_good ) {
               console.log("PAGE-DATA: articleDOWN ok",this.rslt);
             } else {
               console.error("PAGE-DATA: http articleDOWN rslt no good", this.rslt.error);
             }
         },
         response => {
             console.error("PAGE-DATA: articleDOWN call in error", response);
             this.rslt = this.dataService.check_error(response);
             console.error('PAGE-DATA: ERROR articleDOWN-> status:',this.rslt.status);
             console.error('PAGE-DATA: ERROR articleDOWN-> message:',this.rslt.error);
         },
         () => {
             //console.log("The POST observable is now completed.");
        }
      );
    this.page_details[index] = this.page_details[index + 1];
    this.page_details[index + 1] = temp;
    this.page_html[index] = this.page_html[index + 1];
    this.page_html[index + 1] = temp2;
  } // articleDOWN

}
