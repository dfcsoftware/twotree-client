import { Injectable } from '@angular/core';

import {DataService, Result, Return, User
} from './data.service';


@Injectable()
export class AuthService {
   rslt : Result = new Result();

  constructor(private dataService : DataService) {
  }

  login(user: string, password: string, callback:(msg:any) => void) {
      this.dataService.login(user,password)
        .subscribe(
         (val) => {
             //console.log("POST call successful value returned in body",
             //            val);
             this.rslt = this.dataService.check_results(val);
             if (this.rslt.status == Return.http_good &&
                 this.rslt.payload == "OK" ) {
               // already logged in
               // TODO: Obsolete since fixing UUID new?
               console.log("AUTH: Logged in");
               sessionStorage.setItem("name", user);
               callback(this.rslt);
             } else if (this.rslt.status == Return.http_good) {
               console.log("AUTH: Login ok");
               console.log("AUTH: ",this.rslt.payload[0].uuid);
               sessionStorage.setItem("name", user);
               callback(this.rslt);
             } else {
               this.dataService.clearAuth();
               console.error("AUTH: ",this.rslt.error);
               // TODO : this.logout((msg) => {});
               callback(this.rslt); // not reachable?
             }
         },
         response => {
             console.log("POST call in error", response);
             console.error("AUTH-1: ",response);
             this.rslt = this.dataService.check_error(response);
             console.error("AUTH: ",this.rslt);
             callback(this.rslt);
         },
         () => {
             //console.log("The POST observable is now completed.");
        });
  } // login

  logout(callback:(msg:any) => void) {
      this.dataService.logoff()
        .subscribe(
         (val) => {
             console.log("POST call successful value returned in body",
                         val);
             this.rslt = this.dataService.check_results(val);
             if (this.rslt.status == Return.http_good &&
                 this.rslt.payload == "loggedoff" ) {
               // already logged in
               console.log("AUTH: Logged off");
               sessionStorage.removeItem("name");
               this.dataService.clearAuth();
               callback(this.rslt);
             } else {
               console.error("AUTH: ", this.rslt.error);
               callback(this.rslt);
             }
         },
         response => {
             console.log("POST call in error", response);
             console.error("AUTH-2: ",response);
             this.rslt = this.dataService.check_error(response);
             console.error("AUTH: ",this.rslt);
             callback(this.rslt);
         },
         () => {
             //console.log("The POST observable is now completed.");
        }
      );
  } // logout

  getUser(): any {
    return sessionStorage.getItem('name');
  } // getUser

  getLocalUser(callback:(msg:any) => void) {
    this.dataService.getLocalUser()
        .subscribe(
         (val) => {
             //console.log("AUTH: getLocalUser call successful value returned in body",
                      // val);
             callback(val);
         },
         response => {
             console.warn("AUTH: getLocalUser call in error", response);
         },
         () => { // localStorage never send this...
             console.log("AUTH: The getLocalUser observable is now completed.");
         }
      )
  } // getLocalUser

  isLoggedIn(): boolean {
    return this.getUser() !== null;
  }

}

export const AUTH_PROVIDERS: Array<any> = [
     { provide: AuthService, useClass: AuthService }
    ];
