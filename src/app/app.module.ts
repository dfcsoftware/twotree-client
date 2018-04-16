import { BrowserModule
 } from '@angular/platform-browser';

import { NgModule, APP_INITIALIZER
 } from '@angular/core';

import { RouterModule, Routes
} from '@angular/router';

import {SuiModule
} from 'ng2-semantic-ui';

import { AsyncLocalStorageModule
} from 'angular-async-local-storage';

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

import  {
  DragulaModule
} from 'ng2-dragula';

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
    LoginComponent
  ],
  imports: [
    BrowserModule,
    SuiModule,
    AsyncLocalStorageModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DragulaModule,
    RouterModule.forRoot(
      routes  // as childRoutes,
      //,{ enableTracing: true } // <-- debugging purposes only
    )
    //RouterModule.forRoot(routes, { useHash: true })
  ],
  providers: [
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
