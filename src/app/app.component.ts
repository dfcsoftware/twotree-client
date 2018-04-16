import { Component
} from '@angular/core';
import { Router
} from '@angular/router';
//----------------------------------------------------------------------------//
//   A P P
//----------------------------------------------------------------------------//
import {MenuDataService
} from './menu/menu-data.service';

@Component({
  selector: 'app-root',
  providers: [MenuDataService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Two Trees';

  constructor(private router: Router) {

  }

  ngOnInit() {
    //this.menuDataService.getFunktionsDemo();
  }


}
