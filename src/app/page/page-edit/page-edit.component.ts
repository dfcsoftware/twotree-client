import { Component, OnInit
} from '@angular/core';

import { ActivatedRoute
} from '@angular/router';

import { AuthService
} from '../../auth.service';

import {PageDataService
} from '../page-data.service';

import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ReactiveFormsModule
} from '@angular/forms';

@Component({
  selector: 'app-page-edit',
  providers: [PageDataService],
  templateUrl: './page-edit.component.html',
  styleUrls: ['./page-edit.component.css']
})
export class PageEditComponent implements OnInit {
  pageURL    : string;
  param1     : string;
  pageTitle  : string;
  itemName   : string;
  ba_id      : string;
  f_id       : string;
  message    : string;
  privateItem: boolean = false;
  pageFormGroup   : FormGroup;

  constructor(private activatedRoute: ActivatedRoute,
              public authService: AuthService,
              public pageDataService: PageDataService,
              formBuilder: FormBuilder) {
    console.log(activatedRoute.snapshot);
    this.message='';
    this.pageURL = activatedRoute.snapshot.url[1].path;
    this.pageTitle = activatedRoute.snapshot.queryParams.p;
    console.log("PAGE-EDIT  URL",this.pageURL,this.pageTitle);
    this.pageFormGroup = new FormGroup({
       title : new FormControl('',[Validators.minLength(4),Validators.required]),
       obj   : new FormControl('Page'),
       priv  : new FormControl(false)
    });
  }

  error(s:string) {
    console.warn("PAGE-EDIT:",s);
  }

  ngOnInit() {
    console.log("PAGE-EDIT");
    /*
    this.pageFormGroup = new FormGroup({
       title : new FormControl('',Validators.minLength(3)),
       obj   : new FormControl('Page'),
       priv  : new FormControl(false)
    });
    */
    this.pageDataService.getObject(this.pageURL,
      ( error , result, ba_id, f_id ) : void => {
        this.pageFormGroup = new FormGroup({
          title : new FormControl(this.pageTitle,[Validators.minLength(4),Validators.required]),
          obj   : new FormControl(result[0]),
          priv  : new FormControl(false)
        })
        this.ba_id = ba_id;
        this.f_id = f_id;
    });
  } // ngOnInit

	goBack() {
    history.back();
	} // goBack

	savePage(){
	  console.log("PAGE-EDIT: page saved");
	  console.log("PAGE-EDIT: pagename",  this.pageFormGroup.get('title').value);
	  console.log("PAGE-EDIT: page_type", this.pageFormGroup.get('obj').value.value);
	  console.log("PAGE-EDIT: priv",      this.pageFormGroup.get('priv').value);
	  console.log("PAGE-EDIT: parent_id", this.pageURL);
	  console.log("PAGE-EDIT: business_area_id", this.ba_id);
	  console.log("PAGE-EDIT: function_id",      this.f_id);
	  this.pageDataService.putPageText(this.pageFormGroup.get('title').value,
	                                   this.pageFormGroup.get('obj').value.value,
	                                   this.pageFormGroup.get('priv').value,
                                     this.pageURL,
                                     this.ba_id,
                                     this.f_id,
                                     ( error, result) : void => {
                                       this.message = result;
                                       console.log("PAGE-EDIT savePage:",result);
                                     });
	} // savePage


}
