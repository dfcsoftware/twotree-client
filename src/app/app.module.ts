import { BrowserModule
 } from '@angular/platform-browser';

import { NgModule, APP_INITIALIZER
 } from '@angular/core';

import { RouterModule, Routes
} from '@angular/router';

import { TitleCasePipe
} from '@angular/common';

import {SuiModule
} from 'ng2-semantic-ui';

import { AppComponent
} from './app.component';

import { MenuComponent
} from './menu/menu.component';

import { FilterObjectPipe
} from './app.filter-object';

import { SafeHtmlPipe
} from './app.filter-safe';

import { FunkComponent
} from './funk/funk.component';

import { PageComponent
} from './page/page.component';

import { DetailComponent
} from './page/detail/detail.component';

import { PageAddComponent
} from './page/page-add/page-add.component';

import { PageEditComponent
} from './page/page-edit/page-edit.component';

import { LoginComponent
} from './login/login.component';

import { AUTH_PROVIDERS
} from './auth.service';

import { LoggedInGuard
} from './logged-in.guard';

import { FormsModule, ReactiveFormsModule
} from '@angular/forms';

import {HttpClientModule
} from '@angular/common/http';

import { DataService
} from './data.service';


export function init_app(dataService: DataService){
    // Do initing of services that is required before app loads
    // NOTE: this factory needs to return a function (that then returns a promise)
    return () => dataService.getSettings()  // + any other services...
}

  const routes: Routes = [
  // basic routes
   { path: '', redirectTo: 'home', pathMatch: 'full' },
   //{ path: '#/', redirectTo: '#/home', pathMatch: 'full' },
   { path: 'home',     component: FunkComponent },
   { path: 'business', component: FunkComponent },
   { path: 'event',    component: FunkComponent },
   { path: 'family',   component: FunkComponent },
   { path: 'place',    component: FunkComponent },
   { path: 'login',    component: LoginComponent },
   {
     path: 'page/:id',
     component: PageComponent,
     canActivate: [ LoggedInGuard ]
   },
   {
     path: 'pageAdd/:id',
     component: PageAddComponent,
     canActivate: [ LoggedInGuard ]
   },
   {
     path: 'pageEdit/:id',
     component: PageEditComponent,
     canActivate: [ LoggedInGuard ]
   }
  ];

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    FilterObjectPipe,
    SafeHtmlPipe,
    FunkComponent,
    PageComponent,
    DetailComponent,
    LoginComponent,
    PageAddComponent,
    PageEditComponent
  ],
  imports: [
    BrowserModule,
    SuiModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(
      routes  // as childRoutes,
      //,{ enableTracing: true } // <-- debugging purposes only
    )
    //RouterModule.forRoot(routes, { useHash: true })
  ],
  providers: [
    TitleCasePipe,
    AUTH_PROVIDERS,
    LoggedInGuard,
    DataService,
    {
            'provide': APP_INITIALIZER,
            'useFactory': init_app,
            'deps': [DataService],
            'multi': true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
