import { Injectable
} from '@angular/core';

/*
 * 3rd Party
 */
//import '..vendor/Wiky.js';
declare var Wiky: any;
import { toHtml, toWiky
} from '../vendor/Wiky';

/*
 * Twotree
 */
import { pageItem,
         pageDetail,
         pageData
} from './page.model';

import { DataService, Return, Result, Settings
} from '../data.service';

@Injectable()
export class PageDataService {
  rslt : Result = new Result();
  pageTitle    : string;
  pageID       : string;
  activeDetail : boolean = false;
  page_items   : Array<pageItem>;
  page_details : Array<pageDetail>;
  page_html    : Array<pageDetail>;
  page_data    : Array<pageData>;
  public pageItems   : pageItem;
  public pageDetails : pageDetail;
  public pageDatas   : pageData;

  constructor(private dataService : DataService) {
    this.pageItems   = new pageItem(null);
    this.pageDetails = new pageDetail(null);
    this.pageDatas   = new pageData(null);
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
                  this.getHTTPPage(parent_id); // refresh local from network
                  },
        response => {
                    console.warn("PAGE-DATA: getPageLocal call in error", response);
                    this.getHTTPPage(parent_id); // refresh local from network
                    },
              () => { // localStorage never send this...
                    console.log("PAGE-DATA: The getPageLocal observable is now completed.");
                    }
               )
  }  // getLocalPage

  getHTTPPage(parent_id:string){
    this.dataService.getPage(parent_id)
        .subscribe(
         (val) => {
             console.log("PAGE-DATA: getPage call successful value returned in body",
                         val);
             this.rslt = this.dataService.check_results(val);
             if (this.rslt.status == Return.http_good ) {
               console.log("PAGE-DATA: getPage ok",this.rslt);
               this.assignPage(this.rslt.payload,true);
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
      this.getHTTPPage(parent_id);
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

  convertToWiky(text) {
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

}
