export interface IFunktion {
  ba        : string;
  ba_id     : string;
  ba_seq    : number;
  f         : string;
  f_id      : string;
  f_url     : string;
  f_seq     : number;
  authlevel : number;
}

export class Funktion {
  ba        : string;
  ba_id     : string;
  ba_seq    : number;
  f         : string;
  f_id      : string;
  f_url     : string;
  f_seq     : number;
  authlevel : number;

  constructor(item : Funktion) {
      //console.log(item);
    if (item) {
      this.ba        = item.ba;
      this.ba_id     = item.ba_id;
      this.ba_seq    = item.ba_seq;
      this.f         = item.f;
      this.f_id      = item.f_id;
      this.f_url     = item.f_url;
      this.f_seq     = item.f_seq;
      this.authlevel = item.authlevel;
    } else {
      this.ba        = '';
      this.ba_id     = '';
      this.ba_seq    = 0;
      this.f         = '';
      this.f_id      = '';
      this.f_url     = '';
      this.f_seq     = 0;
      this.authlevel = 0;
    }
  }

  get_demo() : any {
      var f_demo = Array<Funktion>();
      f_demo.push(new Funktion(JSON.parse('{"ba":"Home","ba_id":"HOME","ba_seq":1,"f":"Notes","f_id":"NOTES","f_url":"#/page/NOTES_PAGE","f_seq":1,"authlevel":4}')));
      f_demo.push(new Funktion(JSON.parse('{"ba":"Home","ba_id":"HOME","ba_seq":1,"f":"People","f_id":"PEOPLE","f_url":"#/page/PEOPLE_PAGE","f_seq":2,"authlevel":4}')));
      f_demo.push(new Funktion(JSON.parse('{"ba":"Home","ba_id":"HOME","ba_seq":1,"f":"Picture","f_id":"PICTURE","f_url":"#/page/PICTURES_1410182768191_PAGE","f_seq":3,"authlevel":4}')));
      f_demo.push(new Funktion(JSON.parse('{"ba":"Home","ba_id":"HOME","ba_seq":1,"f":"Music","f_id":"MUSIC","f_url":"#/page/MUSIC_1411418557423_PAGE","f_seq":4,"authlevel":4}')));
      f_demo.push(new Funktion(JSON.parse('{"ba":"Home","ba_id":"HOME","ba_seq":1,"f":"Food","f_id":"FOOD","f_url":"#/page/FOOD_1411665910400_PAGE","f_seq":5,"authlevel":4}')));
      f_demo.push(new Funktion(JSON.parse('{"ba":"Business","ba_id":"BUSINESS","ba_seq":2,"f":"Topic","f_id":"TOPIC","f_url":"#/page/TOPIC_PAGE","f_seq":1,"authlevel":4}')));
      f_demo.push(new Funktion(JSON.parse('{"ba":"Business","ba_id":"BUSINESS","ba_seq":2,"f":"Task","f_id":"TASK","f_url":"#/page/TASK_1411655196647_PAGE","f_seq":2,"authlevel":4}')));
      f_demo.push(new Funktion(JSON.parse('{"ba":"Business","ba_id":"BUSINESS","ba_seq":2,"f":"Contact","f_id":"CONTACT","f_url":"#/page/CONTACT_PAGE","f_seq":3,"authlevel":4}')));
      f_demo.push(new Funktion(JSON.parse('{"ba":"Family","ba_id":"FAMILY","ba_seq":3,"f":"Tree","f_id":"TREE","f_url":"#/page/TREE_1412709392332_PAGE","f_seq":1,"authlevel":4}')));
      f_demo.push(new Funktion(JSON.parse('{"ba":"Event","ba_id":"EVENT","ba_seq":4,"f":"Plan","f_id":"PLAN","f_url":"#/page/PLAN_1414090128413_PAGE","f_seq":1,"authlevel":4}')));
      f_demo.push(new Funktion(JSON.parse('{"ba":"Event","ba_id":"EVENT","ba_seq":4,"f":"News","f_id":"NEWS","f_url":"#/feed","f_seq":2,"authlevel":4}')));
      f_demo.push(new Funktion(JSON.parse('{"ba":"Place","ba_id":"PLACE","ba_seq":5,"f":"Work","f_id":"WORK","f_url":"#/page/WORK_1413223609758_PAGE","f_seq":1,"authlevel":4}')));
      f_demo.push(new Funktion(JSON.parse('{"ba":"Place","ba_id":"PLACE","ba_seq":5,"f":"Play","f_id":"PLAY","f_url":"#/page/PLAY_1413223684724_PAGE","f_seq":2,"authlevel":4}')));
      f_demo.push(new Funktion(JSON.parse('{"ba":"Place","ba_id":"PLACE","ba_seq":5,"f":"Store","f_id":"STORE","f_url":"#/page/STORE_1413223697792_PAGE","f_seq":3,"authlevel":4}')));
      f_demo.push(new Funktion(JSON.parse('{"ba":"Administration","ba_id":"ADMIN","ba_seq":10,"f":"Admin","f_id":"ADMIN","f_url":"#/admin/roles","f_seq":3,"authlevel":4}')));

    return f_demo;
  }
}
//----------------------------------------------------------------------------//
export interface IBusinessArea{
  ba        : string;
  ba_id     : string;
  ba_url    : string;
  ba_seq    : number;
  authlevel : number;
}

export class BusinessArea{
  ba        : string;
  ba_id     : string;
  ba_url    : string;
  ba_seq    : number;
  authlevel : number;


  constructor(item : BusinessArea) {
    //console.log(item);
    if (item) {
      this.ba        = item.ba;
      this.ba_id     = item.ba_id;
      this.ba_url    = item.ba_url;
      this.ba_seq    = item.ba_seq;
      this.authlevel = item.authlevel;
    } else {
      this.ba        = '';
      this.ba_id     = '';
      this.ba_url    = '';
      this.ba_seq    = 0;
      this.authlevel = 0;
    }
  }

  get_demo() : any  {
    var ba_demo = Array<BusinessArea>();
    ba_demo.push(new BusinessArea(JSON.parse('{"ba":"Business","ba_id":"BUSINESS","ba_url":"#/business","ba_seq":2,"authlevel":4}')));
    ba_demo.push(new BusinessArea(JSON.parse('{"ba":"Family","ba_id":"FAMILY","ba_url":"#/family","ba_seq":3,"authlevel":4}')));
    ba_demo.push(new BusinessArea(JSON.parse('{"ba":"Event","ba_id":"EVENT","ba_url":"#/event","ba_seq":4,"authlevel":4}')));
    ba_demo.push(new BusinessArea(JSON.parse('{"ba":"Place","ba_id":"PLACE","ba_url":"#/place","ba_seq":5,"authlevel":4}')));
    ba_demo.push(new BusinessArea(JSON.parse('{"ba":"Account","ba_id":"ACCOUNT","ba_url":"#/login","ba_seq":9,"authlevel":1}')));
    ba_demo.push(new BusinessArea(JSON.parse('{"ba":"Administration","ba_id":"ADMIN","ba_url":"#/admin/roles","ba_seq":10,"authlevel":4}')));

    return ba_demo;
  }
}
