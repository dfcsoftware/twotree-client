import { Pipe, PipeTransform
} from '@angular/core';

import { DomSanitizer
} from '@angular/platform-browser';

/*
 *  Usage :  <div class="wiki detail" [innerHTML]="text | safeHtml"></div>
 *
 *   Where text is an HTML markup string
 *
 */

@Pipe({name: 'safeHtml'})
export class SafeHtmlPipe {
  constructor(private sanitizer:DomSanitizer){}

  transform(style) {
    return this.sanitizer.bypassSecurityTrustHtml(style);
    //return this.sanitizer.bypassSecurityTrustStyle(style);
    // return this.sanitizer.bypassSecurityTrustXxx(style); - see docs
  }
}
