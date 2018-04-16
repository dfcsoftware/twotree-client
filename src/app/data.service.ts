import { environment // API_URL for dev and prod
} from 'environments/environment';

import { Injectable
} from '@angular/core';

import { HttpClient, HttpHeaders, HttpErrorResponse
} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';
import { catchError, tap
} from 'rxjs/operators';
import 'rxjs/add/operator/retry';
//import 'rxjs/add/operator/catch';

import { AsyncLocalStorage, JSONSchema
} from 'angular-async-local-storage';

import { BusinessArea, IBusinessArea, Funktion, IFunktion
} from './menu/menu.model';

import {pageData, IpageData
} from './page/page.model';

import t from 'typy';
/**********************************************************
 *  Unique identifier for this client session
 */
class UUID{

  constructor(){
    if ( ! sessionStorage.getItem('auth_token') ) {
      let d = new Date().getTime();//performance.now(); <- only works on desktop, not mobile!
      let guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[x]/g, function(c) {
        let r = (d + Math.random()*16)%16 | 0;
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
      });
      sessionStorage.setItem('auth_token', guid);
    }
  }

  get() {
    return sessionStorage.getItem('auth_token');
  };

  del() {
    sessionStorage.removeItem('auth_token');
  }
} // UUID

/**********************************************************
 *  Store data locally in IndexedDB
 *
 *
 *  User is verified before serving local pages
 *
 */
export interface User {
  name: string;
  lastTime: string;
}

export interface Settings {
  saveData:boolean;
}

/**********************************************************
 *  Network interfaces
 */
const API_URL = environment.API_URL;//Object.assign({},environment.API_URL);
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign

export class Result  {
    status : number;
    error  : string;
    payload: any;
}

export interface Response {
  result: string; // Result
  id: string;
  jsonrpc: string;
}

export class Return{
  public static version: string = '1';
  public static result_need_login: number =  2;
  public static result_bad:        number =  1;
  public static result_good:       number =  0;
  public static http_good:         number =  200;
  public static http_unauthorized: number =  401;
  public static http_internal:     number =  500;

  public static ipc_need_login: any = {"status":2,
                "error":"LOGIN",
                "payload":""
              };
  public static ipc_bad: any = {"status":1,
                "error":"BAD",
                "payload":""
              };
  public static ipc_good: any = {"status":0,
                "error":"",
                "payload":"GOOD"
              };
  public static http_200: any = {"status":200,
                "error":"",
                "payload":"OK"
              };
  public static http_401: any = {"status":401,
                "error":"Unauthorized",
                "payload": ""
              };
  public static http_500: any = {"status":500,
                "error":"Internal miscombobulation",
                "payload": ""
              };
}

/**********************************************************
 *  MAIN Class
 */
@Injectable()
export class DataService {
  uuid : UUID;
  localUser     : User;
  localSettings : Settings;
  public businessArea : BusinessArea;
  public funktion : Funktion;

  constructor(private http: HttpClient,
              protected localStorage: AsyncLocalStorage){
     this.uuid = new UUID();
     this.businessArea = new BusinessArea(null);
     this.funktion = new Funktion(null);
  } // constructor

   isString(x) {
     if (x) {
      return Object.prototype.toString.call(x) === "[object String]";
     } else {
      return false;
     }
   } // isString

   private handleHttpError(operation: String, url: String) {
        return (err: any) => {
            let errMsg = `DATA: error in ${operation}() retrieving ${url} `;
            console.log(`${errMsg}:`, err)
            if(err instanceof HttpErrorResponse) {
                // you could extract more info about the error if you want, e.g.:
                console.log(`DATA: status: ${err.status}, ${err.statusText}`);
                errMsg = errMsg + `status: ${err.status}, ${err.statusText}`;
            }
            return Observable.throw(errMsg);
        }
    } // handleHttpError

   check_error(response : any):Result { // http error response
    let rslt : Result;
     rslt = Return.http_500;
     if ( t(response, 'response.status').isNumber ) {
        rslt.status = response.status;
     } else {
        rslt.status = 0;
     }
     console.log("DATA: response:",response);
     if ( t(response, 'response').isString ) {
        rslt.error = t(response, 'response').safeObject;
        console.warn("DATA-0:",rslt.error);
     } else if ( t(response, 'response.error').isString ) {
        rslt.error = response.error;
        console.warn("DATA-1:",response.error);
     } else if ( t(response, 'response.error.message').isString ) { // return.http_internal
        rslt.error = response.error.message;
        console.warn("DATA-2:",response.error.message);
     } else if ( t(response, 'response.message').isString ) { // return.http_internal
        rslt.error = response.message;
        console.warn("DATA-3:",response.message);
     } else {
        rslt.error = "Unknown";
     }
     return rslt;
   } // check_error

   check_results(results: any):Result {
    let query    : any;
    let result   : any;
    let rslt     : Result;
    query = results;

    if (query.error) {
      console.error('DATA: http error:',query.error); // http
      rslt = Return.http_500;
      rslt.error = query.error;
      return rslt;
    }
    result = JSON.parse(query.result);
    // TODO: handle 401, send to login page
    if (parseInt(result.status, 10) != 200) {
      console.warn('DATA: DB error:',result.error);
      console.warn('DATA: DB status:',result.status);
      rslt = Return.http_500;
      rslt.status = result.status; // override 500 with actual code
      if ( this.isString(result.error) ) {
            rslt.error = result.error;
            console.warn("DATA-1:",result.error);
      } else if ( this.isString(result.error.message) ) { // return.http_internal
            rslt.error = result.error.message;
            console.warn("DATA-2:",result.error.message);
      } else if ( this.isString(result.message) ) { // return.http_internal
            rslt.error = result.message;
            console.warn("DATA-3:",result.message);
      } else {
            rslt.error = "Unknown error";
            console.warn("DATA-4: Unknown");
      }
      return rslt;
    }
    console.log("DATA: good result",result);
    //console.log("DATA: ",result.payload);
    rslt = Return.http_200;
    rslt.payload = result.payload;
    return rslt;
  } // check_results

  /*************************************************************************
   * User and Authentication
   */

  clearAuth() {
    this.uuid.del();
  }

  getLocalUser() {
    const schema: JSONSchema = {
      properties: {
        name:      { type: 'string' },
        lastTime:  { type: 'string' }
      },
      required: ['name', 'lastTime', ]
    };

    return this.localStorage.getItem<User>(
        'user',
        { schema });
  } // getLocalUser

  putLocalUser(username : string )  {
    let d = new Date()
    this.localUser = { name     : username,
                       lastTime : d.toString()};
    this.localStorage.removeItem('user').subscribe(() => {
      this.localStorage.setItem('user', this.localUser).subscribe(() => {
        console.log("DATA: putLocalUser: put",this.localUser);
      });
    });
  } // putLocalUser

  delLocalUser()  {
    this.localStorage.removeItem('user').subscribe(() => {
        console.log("DATA: delLocalUser: del");
    });
  } // delLocalUser

  login(username:string,password:string){
    this.uuid = new UUID();
    var authToken = this.uuid.get();
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type'  : 'application/json',
          'Accept'        : 'application/json',
          'Authorization' : 'key ' +authToken
      })
    };

    return this.http.post<Response>(
        API_URL,
        JSON.stringify({
          jsonrpc: "2.0",
          id:authToken,
          method:'validate',
          params:{u:username,p:password}
         }),
         httpOptions);
  } // login

  logoff(){
    var authToken = this.uuid.get();
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type'  : 'application/json',
          'Accept'        : 'application/json',
          'Authorization' : 'key ' +authToken
      })
    };

    return this.http.post<Response>(
        API_URL,
        JSON.stringify({
          jsonrpc: "2.0",
          id:authToken,
          method:'logoff',
          params:{}
         }),
         httpOptions);
  } // logoff

  /************************************************************************
   *  Settings
   */
  putLocalSettings(newValues : Settings){
    this.localStorage.removeItem('settings').subscribe(() => {
      this.localStorage.setItem('settings', newValues).subscribe(() => {
        console.log("DATA: putLocalSettings: put",newValues);
        this.getSettings();
      });
    });
  }

  getSettings() : Promise<{}> {
    const schema: JSONSchema = {
      properties: {
        saveData:  { type: 'boolean' }
      },
      required: ['saveData']
    };
    let resolvePromise = null;
    const promise = new Promise(resolve => resolvePromise = resolve);
    promise.then(val => console.log("DATA-Settings:",val));

    //console.log("DATA: getSettings called, current settings are ",this.localSettings);

    this.localStorage.getItem<Settings>(
        'settings',
        { schema }
        ).subscribe(
          (val) => {
             //console.log("DATA: getLocalSettings call successful value returned in body",
             //          val);
             this.localSettings = val ? val : Object.assign({},environment.defaultSettings);
             //console.log("DATA:",this.localSettings);
             resolvePromise(this.localSettings);
         },
         response => {
             console.warn("DATA: getLocalSettings call in error", response);
             resolvePromise(response);
         },
         () => { // localStorage never send this...
             console.log("DATA: The getLocalSettings observable is now completed.");
         });

   return promise;
  } // getLocalSettings

  getLocalSettings(): Settings {
    return this.localSettings;
  } // getLocalSettings

  clearLocalData(){
    console.warn("DATA: clearLocalData");
    // TODO: refresh localSettings
    return this.localStorage.clear();
  }
  /************************************************************************
   * Menu Business Area and Function
   */
  getMenuBusinessArea() {
    var authToken = this.uuid.get();
    const httpOptions = {
      headers: new HttpHeaders({
          'Authorization' : 'key ' +authToken
      })
    };
    console.log("DATA: getting auth business_area data.");
    return this.http.get<Response>(
        API_URL + "/get_authorization?action=business_area&id=GUEST",
        httpOptions)
        .retry(3)
        .pipe(
                tap(data => console.log('DATA: server data:', data)),
                catchError(this.handleHttpError('getMenuBusinessArea','business_area'))
            );
  } // getMenuBusinessArea

  putMenuBusinessAreaLocal( localBusinessArea : Array<BusinessArea> ) {
    this.localStorage.removeItem('menu_ba').subscribe(() => {
      this.localStorage.setItem('menu_ba', localBusinessArea).subscribe(() => {
        console.log("DATA: putMenuBusinessAreaLocal: put",localBusinessArea);
      });
    });
  } // putMenuBusinessAreaLocal

  getMenuBusinessAreaLocal() {
    const schema: JSONSchema = {
      properties: { //Array<IBusinessArea> }
                  ba        : { type: 'string'},
                  ba_id     : { type: 'string'},
                  ba_url    : { type: 'string'},
                  ba_seq    : { type: 'number'},
                  authlevel : { type: 'number'}
                  }
    };

    return this.localStorage.getItem<IBusinessArea>(
        'menu_ba');
  } // getMenuBusinessAreaLocal

  getMenuFunktion() {
    var authToken = this.uuid.get();
    const httpOptions = {
      headers: new HttpHeaders({
          'Authorization' : 'key ' +authToken
      })
    };
    console.log("DATA: getting auth function data.");
    return this.http.get<Response>(
        API_URL + "/get_authorization?action=function&id=GUEST",
        httpOptions)
        .retry(3)
        .pipe(
                tap(data => console.log('DATA: server data:', data)),
                catchError(this.handleHttpError('getMenuFunktion','function'))
            );;
  } // getMenuFunktion

  putMenuFunktionLocal( localFunktion : Array<Funktion> ) {
    this.localStorage.removeItem('menu_f').subscribe(() => {
      this.localStorage.setItem('menu_f', localFunktion).subscribe(() => {
        console.log("DATA: putMenuFunktionLocal: put",localFunktion);
      });
    });
  } // putMenuFunktionLocal

  getMenuFunktionLocal() {
    const schema: JSONSchema = {
      properties: {
                   ba        : { type: 'string'},
                   ba_id     : { type: 'string'},
                   ba_seq    : { type: 'number'},
                   f         : { type: 'string'},
                   f_id      : { type: 'string'},
                   f_url     : { type: 'string'},
                   f_seq     : { type: 'number'},
                   authlevel : { type: 'number'}
                  }
    };

    return this.localStorage.getItem<IFunktion>(
        'menu_f');
  } // getMenuBusinessAreaLocal

 /*************************************************************************
  *  P A G E
  */
  getPage(parent_id:string) {
    var authToken = this.uuid.get();
    const httpOptions = {
      headers: new HttpHeaders({
          'Authorization' : 'key ' +authToken
      })
    };
    console.log("DATA: getting page data.");
    return this.http.get<Response>(
        API_URL + "/get_child_pages?parent_id="+parent_id,
        httpOptions)
        .retry(3)
        .pipe(
                tap(data => console.log('DATA: server data:', data)),
                catchError(this.handleHttpError('getPage',parent_id))
            );
        //.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  } // getPage

  putPageLocal( parent_id:string, localPage : Array<pageData> ) {
    this.localStorage.removeItem(parent_id).subscribe(() => {
      this.localStorage.setItem(parent_id, localPage).subscribe(() => {
        console.log("DATA: putPageLocal: put",localPage);
      });
    });
  } // putPageLocal

  getPageLocal(parent_id:string) {
    return this.localStorage.getItem<IpageData>(
        parent_id);
  } // getPageLocal

  moveItemData(parent_id:string, from_loc:string, to_loc:string) {
    var authToken = this.uuid.get();
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type'  : 'application/json',
          'Accept'        : 'application/json',
          'Authorization' : 'key ' +authToken
      })
    };

    return this.http.post<Response>(
        API_URL,
        JSON.stringify({
          jsonrpc: "2.0",
          id:authToken,
          method:'move_item',
          params:{page_id:parent_id, from_pos:from_loc, to_pos:to_loc}
         }),
         httpOptions);
  } // move_pageItem

}
