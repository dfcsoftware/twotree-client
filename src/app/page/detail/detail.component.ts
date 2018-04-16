import { Component, OnInit, Input
} from '@angular/core';

import {PageDataService
} from '../page-data.service';

import {pageDetail
} from '../page.model';

@Component({
  selector: 'app-detail',
  providers: [PageDataService],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  @Input() page_html: Array<pageDetail>;
  @Input() pageTitle: string;

  constructor(private pageDataService : PageDataService) {
  }

  ngOnInit() {
  }


}
