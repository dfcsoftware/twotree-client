import { environment
} from 'environments/environment';

import { Component, OnInit, ViewChild
} from '@angular/core';

import {SuiModalService, TemplateModalConfig, ModalTemplate, ModalSize
} from 'ng2-semantic-ui';

import { Return, User
} from '../data.service';

import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ReactiveFormsModule
} from '@angular/forms';

import { AuthService
} from '../auth.service';

import { DataService, Settings
} from '../data.service';

import { MenuDataService
} from '../menu/menu-data.service';

// Modal
export interface IContext {
    data:string;
}

//declare var nav: any = navigator;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('modalTemplate')
    public modalTemplate:ModalTemplate<IContext, string, string>
  msgGood   : string;
  msgBad    : string;
  username  : string;
  password  : string;
  loginForm : FormGroup;
  localStorage : string = '';

  constructor(public authService: AuthService,
              formBuilder: FormBuilder,
              private dataService: DataService,
              public modalService:SuiModalService,
              private menuDataService: MenuDataService) {
    this.msgGood  = '';
    this.msgBad   = '';
    this.username = '';
    this.password = '';
    this.loginForm = formBuilder.group({
        username: ['', [Validators.required,Validators.minLength(3)]],
        password: ['', [Validators.required,Validators.minLength(6)]]
     });
  }

  ngOnInit() {
    var nav: any = navigator;
    nav.storage.estimate()
      .then((data)=>{
                     console.log("LOGIN: Storage used:",data);
                     this.localStorage = this.numberWithCommas((data.usage/1024/1024).toFixed(2));
                     // data.quota).toFixed(2));
                    }
           )
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  putLocalSettings(newValues : Settings){
    this.dataService.putLocalSettings(newValues);
    if (this.dataService.getLocalSettings().saveData) {
      this.dataService.putLocalUser(this.authService.getUser());
    }
  } // putLocalSettings

  clearSettings(dynamicContent:string = "This will remove all Twotree settings and offline pages from the local browser.") {
    const config = new TemplateModalConfig<IContext, string, string>(this.modalTemplate);

    config.closeResult = "cleared!";
    config.context = { data: dynamicContent };
    config.size = ModalSize.Mini;
    //console.log(ModalSize);
    this.modalService
        .open(config)
        .onApprove(result => { /* approve callback */
                               this.clearLocalData();
                  })
        .onDeny(result => { /* deny callback */
                            console.log("LOGIN: clearLocalData cancelled");
               });
  } // clearSettings

  clearLocalData() {
    this.dataService.localSettings.saveData=false;
    this.putLocalSettings(this.dataService.localSettings);
    this.dataService.clearLocalData().subscribe(() => {
        // noting to do here
      });
  } // clearLocalData

  login(): void {
    this.msgGood = '';
    this.msgBad = '';
    this.authService.login(this.username, this.password, (msg) => {
        this.password='';
        if (msg.status == Return.http_good) {
          //console.log(msg);console.log("callback uuid:"+msg.payload[0].uuid);
          //this.message = "uuid:"+msg.payload[0].uuid + " => refreshing menu...";
          this.msgGood = "Welcome to the machine " + this.username +
                         " ( refreshing menu . . .)";
          setTimeout(function() {
          // TODO: assign to original page?
          //if (this.message.startsWith("Login ok")) {window.location.assign("/twotree")}
             this.msgGood = '';
             window.location.href = '/twotree/login';
          }.bind(this), 2500);
        } else {
          this.msgBad = msg.error;
          console.log("LOGIN: ",msg);
          console.log("LOGIN: err:"+this.msgBad);
        }
      })
  } // login

  logout(): void {
    this.msgGood = '';
    this.msgBad = '';
    this.authService.logout((msg) => {
       if (msg.status == Return.http_good) {
          console.log(msg);
          this.msgGood = "Goodbye " + this.username +
                         " ( refreshing menu . . .)";
          this.username = '';
          setTimeout(function() {
            this.msgGood = '';
            window.location.href = '/twotree/';
          }.bind(this), 2500);
        } else {
          this.msgBad = msg.error;
          console.log("LOGIN: ",msg);
          console.log("LOGIN: error:"+this.msgBad);
        }
    })
  } // logout

}
