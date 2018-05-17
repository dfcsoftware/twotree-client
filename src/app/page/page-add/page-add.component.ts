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
  selector: 'app-page-add',
  providers: [PageDataService],
  templateUrl: './page-add.component.html',
  styleUrls: ['./page-add.component.css']
})
export class PageAddComponent implements OnInit {
  pageURL    : string;
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
    this.pageURL = activatedRoute.snapshot.url[1].path;
    this.pageTitle = activatedRoute.snapshot.queryParams.p;
    console.log("PAGE-ADD Title URL",this.pageTitle,this.pageURL);
    this.pageFormGroup = new FormGroup({
       title : new FormControl('',[Validators.minLength(4),Validators.required]),
       obj   : new FormControl('Page'),
       priv  : new FormControl(false)
    });
  } // constructor

  error(s:string) {
    console.warn("PAGE-ADD:",s);
  }

  ngOnInit() {
    console.log("PAGE-ADD");
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
          title : new FormControl('',[Validators.minLength(4),Validators.required]),
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
	  console.log("PAGE-ADD: page saved");
	  console.log("PAGE-ADD: pagename",  this.pageFormGroup.get('title').value);
	  console.log("PAGE-ADD: page_type", this.pageFormGroup.get('obj').value.value);
	  console.log("PAGE-ADD: priv",      this.pageFormGroup.get('priv').value);
	  console.log("PAGE-ADD: parent_id", this.pageURL);
	  console.log("PAGE-ADD: business_area_id", this.ba_id);
	  console.log("PAGE-ADD: function_id",      this.f_id);
	  this.pageDataService.putPage(this.pageFormGroup.get('title').value,
	                               this.pageFormGroup.get('obj').value.value,
	                               this.pageFormGroup.get('priv').value,
                                 this.pageURL,
                                 this.ba_id,
                                 this.f_id,
                                 ( error, result) : void => {
                                   this.message = result;
                                   console.log("PAGE-ADD savePage:",result);
                                 });
	} // savePage

}
