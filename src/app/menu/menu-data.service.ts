import { environment
} from 'environments/environment';

import { Injectable
} from '@angular/core';

import { BusinessArea,
         Funktion
} from './menu.model';

import { DataService, Return, Result, Settings
} from '../data.service';

@Injectable()
export class MenuDataService {
  rslt : Result = new Result();
  menu_ba  : Array<BusinessArea>;
  menu_f   : Array<Funktion>;
  public businessArea : BusinessArea;
  public funktion : Funktion;

  constructor( private dataService: DataService ) {
    this.businessArea = new BusinessArea(null);
    this.funktion = new Funktion(null);
  }

  getFunkRoute(url : string) : string {
    var inx;
    var rslt = 'home';
    for (inx in this.menu_f) {
      if (this.menu_f[inx].f_url == url ) {
        rslt = this.menu_f[inx].ba.toLowerCase();
      }
    }
    return rslt;
  } //getFunkRoute

  // Simulate GET
  getBusinessAreasDemo() {
    this.menu_ba = this.getMenuBusinessArea(this.businessArea.get_demo(),true);
    //console.log("MenuDataService: constructor");
    //console.log(this.menu_ba);;
  }

  getBusinessAreaLocal(){
    this.dataService.getMenuBusinessAreaLocal()
        .subscribe(
           (val) => {
                   console.log("MENU-B: getMenuBusinessAreaLocal call successful value returned in body",
                    val);
                    if (val) {
                      this.menu_ba = this.getMenuBusinessArea(val,false); //val; <- v6 change
                    }
                    this.getBusinessAreaHTTP(); // refresh local
                    },
        response => {
                    console.warn("MENU-B: getMenuBusinessAreaLocal call in error", response);
                    },
              () => { // localStorage never send this...
                   console.log("MENU-B: The getMenuBusinessAreaLocal observable is now completed.");
                    }
                  )
  } // getBusinessAreaLocal

  getBusinessAreaHTTP(){
    this.dataService.getMenuBusinessArea()
        .subscribe(
         (val) => {
             //console.log("MENU-B: GET call successful value returned in body",
             //            val);
             this.rslt = this.dataService.check_results(val);
             if (this.rslt.status == Return.http_good ) {
               console.log("MENU-B: ok",this.rslt);
               // Strip pound sign
               this.menu_ba = this.getMenuBusinessArea(this.rslt.payload,true);
               //console.log("MENU-B:",this.dataService.getLocalSettings());
               if (this.dataService.getLocalSettings().saveData) {
                 console.log("MENU-B: Saving BusinessArea locally");
                 this.dataService.putMenuBusinessAreaLocal(this.menu_ba);
               }
             } else { // Try loacl database
               console.error("MENU-B: HTTP result not good ", this.rslt.error);
               //this.getBusinessAreaLocal(); // already done
             }
         },
         response => {
             console.error("MENU-B: GET call in error", response);
             this.rslt = this.dataService.check_error(response);
             console.error("MENU-B: ",this.rslt.status,this.rslt.error);
             //this.getBusinessAreaLocal(); // already done
         },
         () => {
             //console.log("The POST observable is now completed.");
        }
      );
  } // getBusinessAreaHTTP

  //  GET
  getBusinessAreas() {
    if (this.dataService.getLocalSettings().saveData) {
      this.getBusinessAreaLocal();
    } else {
      this.getBusinessAreaHTTP();
    }
  } // getBusinessAreas

  // This function strips the pound-sign '#' off the f_url JSON object
  //  TODO: once converted off the angular v1 version, the database can be updated
  //        to remove the pound sign, and this function eliminated.
  getMenuBusinessArea(data : any, strip : boolean) {
     var ba = Array<BusinessArea>();
     var inx : any;
     //console.log("get_menu_business_area");
     //console.log(data);
     //if (data.status = Return.http_good) {
       for (inx in data ) {
         if (strip) {
           data[inx].ba_url = data[inx].ba_url.substring(2,data[inx].ba_url.length);
         }
         ba.push(new BusinessArea(data[inx]));
       }
       return ba;
     //}
  } // getMenuBusinessArea


    // Simulate GET
  getFunktionsDemo() {
    this.menu_f = this.getMenuFunktion(this.funktion.get_demo(),true);
    //console.log("MenuDataService: constructor");
    //console.log(this.menu_f);;
  } // getFunktionsDemo

  getFunktionLocal(){
   this.dataService.getMenuFunktionLocal()
      .subscribe(
        (val) => {
               console.log("MENU-F: getMenuFunktionLocal call successful value returned in body",
                val);
               if (val) {
                 this.menu_f = this.getMenuFunktion(val,false); // val <- v6 change (#)
               }
               this.getFunktionHTTP(); // refresh local
                 },
     response => {
                 console.warn("MENU-F: getMenuFunktionLocal call in error", response);
                 },
           () => { // localStorage never send this...
                console.log("MENU-F: The getMenuFunktionLocal observable is now completed.");
                 }
                )
  } // getFunktionLocal

  getFunktionHTTP(){
    this.dataService.getMenuFunktion()
        .subscribe(
         (val) => {
             //console.log("MENU-F: GET call successful value returned in body",
             //            val);
             this.rslt = this.dataService.check_results(val);
             if (this.rslt.status == Return.http_good ) {
               console.log("MENU-F: ok",this.rslt);
               this.menu_f = this.getMenuFunktion(this.rslt.payload,true);
               if (this.dataService.getLocalSettings().saveData) {
                 console.log("MENU-F: Saving Funktion locally");
                 this.dataService.putMenuFunktionLocal(this.menu_f);
               }
             } else {
               console.error("MENU-F: HTTP result not good", this.rslt.error);
             }
         },
         response => {
             console.error("MENU-F: GET call in error", response);
             this.rslt = this.dataService.check_error(response);
             console.error("MENU-F: ",this.rslt.status,this.rslt.error);
             //this.getFunktionLocal(); // already done
         },
         () => {
             //console.log("The POST observable is now completed.");
        }
      );
  } // getFunktionHTTP

  //  GET
  getFunktion() {
    if (this.dataService.getLocalSettings().saveData) {
      this.getFunktionLocal();
    } else {
      this.getFunktionHTTP();
    }
  } // getFunktion

  // This function strips the pound-sign '#' off the f_url JSON object
  //  TODO: once converted off the angular v1 version, the database can be updated
  //        to remove the pound sign, and this function eliminated.
  getMenuFunktion(data : any, strip : boolean) {
     var f = Array<Funktion>();
     var inx : any;
     //console.log(data);
     for (inx in data) {
       if (strip) {
         data[inx].f_url = data[inx].f_url.substring(7,data[inx].f_url.length);
       }
       f.push(new Funktion(data[inx]));
     }
     return f;
  } // getMenuFunktion

}
