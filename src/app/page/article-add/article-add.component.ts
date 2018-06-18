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
  selector: 'app-article-add',
  providers: [PageDataService],
  templateUrl: './article-add.component.html',
  styleUrls: ['./article-add.component.css']
})
export class ArticleAddComponent implements OnInit {
  pageURL    : string;
  pageTitle  : string;
  itemName   : string;
  ba_id      : string;
  f_id       : string;
  saved      : boolean;
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
    console.log("ARTICLE-ADD Title URL",this.pageTitle,this.pageURL);
    this.pageFormGroup = new FormGroup({
       title : new FormControl('',[Validators.minLength(4),Validators.required]),
       obj   : new FormControl('Article'),
       priv  : new FormControl(false)
    });
  } // constructor

  error(s:string) {
    console.warn("ARTICLE-ADD:",s);
  }

  ngOnInit() {
    console.log("ARTICLE-ADD");
    this.saved = false;
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

	saveArticle(){
	  console.log("ARTICLE-ADD: detail saved");
	  console.log("ARTICLE-ADD: detail name",  this.pageFormGroup.get('title').value);
	  console.log("ARTICLE-ADD: detail_type", this.pageFormGroup.get('obj').value.value);
	  console.log("ARTICLE-ADD: priv",      this.pageFormGroup.get('priv').value);
	  console.log("ARTICLE-ADD: parent_id", this.pageURL);
	  console.log("ARTICLE-ADD: business_area_id", this.ba_id);
	  console.log("ARTICLE-ADD: function_id",      this.f_id);
	  this.saved=true;

	  this.pageDataService.putArticle(this.pageFormGroup.get('title').value,
	                                  this.pageFormGroup.get('obj').value.value,
	                                  this.pageFormGroup.get('priv').value,
                                    this.pageURL,
                                    this.ba_id,
                                    this.f_id,
                                    ( error, result) : void => {
                                      this.message = result;
                                      console.log("ARTICLE-ADD saveArticle:",result);
                                    });

	} // savePage

	editArticle(){
	  console.log("ARTICLE-ADD: detail edit");
	  this.saved = false;
	} // editArticle


}
