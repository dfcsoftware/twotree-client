//----------------------------------------------------------------------------//
//    O B J E C T
//----------------------------------------------------------------------------//
export class pageObject {
  name   : string;
  value  : string;

  constructor(item) {
    if (item) {
      this.name      = item.name;
      this.value     = item.value;
    } else {
      this.name      = '';
      this.value     = '';
    }
  }

}
//----------------------------------------------------------------------------//
//    I T E M
//----------------------------------------------------------------------------//
export class pageItem {
  id   : string;
  nm   : string;
  obj  : string;
  auth : number;

  constructor(item) {
    if (item) {
      this.id      = item.id;
      this.nm      = item.nm;
      this.obj     = item.obj;
      this.auth    = item.auth;
    } else {
      this.id      = '';
      this.nm      = '';
      this.obj     = '';
      this.auth    = 0;
    }
  }

}
//----------------------------------------------------------------------------//
//    D E T A I L
//----------------------------------------------------------------------------//

export class pageDetail {
  id             : string;
  title          : string;
  text           : string;
  dat            : string;
  obj            : string;
  parent_auth_cd : number;

  constructor(detail) {
    if (detail) {
      this.id      = detail.id;
      this.title   = detail.title;
      this.text    = detail.text;
      this.dat     = detail.dat;
      this.obj     = detail.obj;
      this.parent_auth_cd = detail.parent_auth_cd;
    } else {
      this.id      = '';
      this.title   = '';
      this.text    = '';
      this.dat     = '';
      this.obj     = '';
      this.parent_auth_cd = 0;
    }
  }

}
//----------------------------------------------------------------------------//
//    P A G E
//----------------------------------------------------------------------------//
export class IpageData {
  parent_id            : string;
  parent_item          : string;
  parent_auth_cd       : number;
  id_identifier_parent : string;
  child_id             : string;
  child_items          : string;
  child_obj            : string;
  child_seq            : string;
  child_auth           : string;
  items                : Array<pageItem>;
  details              : Array<pageDetail>;
}

export class pageData {
  parent_id            : string;
  parent_item          : string;
  parent_auth_cd       : number;
  id_identifier_parent : string;
  child_id             : string;
  child_items          : string;
  child_obj            : string;
  child_seq            : string;
  child_auth           : string;
  items                : Array<pageItem>;
  details              : Array<pageDetail>;

  constructor(data) {
    if (data) {
      this.parent_id            = data.parent_id;
      this.parent_item          = data.parent_item;
      this.parent_auth_cd       = data.parent_auth_cd;
      this.id_identifier_parent = data.id_identifier_parent;
      this.child_id             = data.child_id;
      this.child_items          = data.child_items;
      this.child_obj            = data.child_obj;
      this.child_seq            = data.child_seq;
      this.child_auth           = data.child_auth;
      this.items                = data.items;
      this.details              = data.details;
    } else {
      this.parent_id            = '';
      this.parent_item          = '';
      this.parent_auth_cd       = 0;
      this.id_identifier_parent = '';
      this.child_id             = '';
      this.child_items          = '';
      this.child_obj            = '';
      this.child_seq            = '';
      this.child_auth           = '';
      this.items                = new Array<pageItem>();
      this.details              = new Array<pageDetail>();
    }
  }

  //----------------------------------------------------------------------------//
  //    D E M O
  //----------------------------------------------------------------------------//
  get_demo() : any {
    var pageDataArray = Array<pageData>();
          var pageDemo = {parent_id:"ORACLE_PAGE",
                          parent_item:"Oracle",
                          parent_auth_cd:4,
                          id_identifier_parent:"DATABASES_1418661408655_PAGE",
                          child_id:"ORACLE_SR_CASE_ESCAL_PAGE;ORACLE_RAC_PAGE;ORACLE_DATAGUARD_PAGE;ORACLE_OID_PAGE;ORACLE_SCRIPTS_PAGE;ORACLE_12C_1413219242062_PAGE;ORCL_GITHUB_1422457264918_PAGE;ORACLE_OEM_1425577291814_PAGE;ORACLE_SQLCL_1428425497902_PAGE;SQL_DEVELOPER_1432219054914_PAGE",
                          child_items:"Oracle SR Case Escalation Process;Oracle RAC;Oracle DataGuard;Oracle OID;Oracle Scripts;Oracle 12c;ORCL Github;Oracle OEM;Oracle SQLcl;SQL Developer",
                          child_obj:"PAGE;PAGE;PAGE;PAGE;PAGE;PAGE;PAGE;PAGE;PAGE;PAGE",
                          child_seq:"1;2;3;4;5;7;8;9;10;11",
                          child_auth:"4;4;4;4;4;4;4;4;4;4",
                          items:[{id:"ORACLE_SR_CASE_ESCAL_PAGE",
                                nm:"Oracle SR Case Escalation Process",
                                obj:"PAGE",
                                auth:4},
                                 {id:"ORACLE_RAC_PAGE",
                                nm:"Oracle RAC",
                                obj:"PAGE",
                                auth:4},
                                 {id:"ORACLE_DATAGUARD_PAGE",
                                nm:"Oracle DataGuard",
                                obj:"PAGE",
                                auth:4},
                                 {id:"ORACLE_OID_PAGE",
                                nm:"Oracle OID",
                                obj:"PAGE",
                                auth:4},
                                 {id:"ORACLE_SCRIPTS_PAGE",
                                nm:"Oracle Scripts",
                                obj:"PAGE",
                                auth:4},
                                 {id:"ORACLE_12C_1413219242062_PAGE",
                                nm:"Oracle 12c",
                                obj:"PAGE",
                                auth:4},
                                 {id:"ORCL_GITHUB_1422457264918_PAGE",
                                nm:"ORCL Github",
                                obj:"PAGE",
                                auth:4},
                                 {id:"ORACLE_OEM_1425577291814_PAGE",
                                nm:"Oracle OEM",
                                obj:"PAGE",
                                auth:4},
                                 {id:"ORACLE_SQLCL_1428425497902_PAGE",
                                nm:"Oracle SQLcl",
                                obj:"PAGE",
                                auth:4},
                                 {id:"SQL_DEVELOPER_1432219054914_PAGE",
                                nm:"SQL Developer",
                                obj:"PAGE",
                                auth:4}
                                ],
                          details:[{id:"SC_CHANGES_1434111806843_ARTICLE",
                                    title:"SC Changes",
                                    text:`Hi All,\n
                                    After the changes done, the frequent spikes in cluster waits were caused by dynamic remastering.\n
                                    \n
                                    Solution provided by _Oracle_ Support (SR 3-10878376361 : Cluster waits in the database):\n
                                    => This is bug which is fixed in 10.2.0.5.7 Patch Set Update. Bug 11674645 - \"gcs drm freeze in enter server mode\" waits in RAC ( Doc ID 11674645.8 )\n
                                    => Workaround - Disable DRM by setting _gc\\_affinity\\_time=0\n
                                    \n
                                    -DBA`,
                                    dat:"2015-06-11T22:00:00.000Z",
                                    obj:"PAGE",
                                    parent_auth_cd:4},
                                   {id:"CHANGES_1410958607880_ARTICLE",
                                    title:"Help",
                                    text:`
1. List one\\\\
1. List two\\\\
1* Indent list

==h2==

===h3===

[(google,Edgar Allan Poe)"Quote -- Said the raven... nevermore."]

; selfie: pictures of me

[| *heading* |2>columns||
| center | this | is a | table |
|left  |yo |yo |yo |
|  right| ho| ho| ho|
|squished|yi|yi|yi|]

-> <-

{_} underline

{>>} right align\\\\
more text

{<<} left align


{c:green} color green

{>}Indented paragraph with _italics_ and *bold*.\\\\
This should be a new line.
[http://google.com,Google link]\\\\

{>;c:red;C:#aef} Red with teal background colors

{>>,w:40\\%,b} Right align at 40\\% in a border


{ ,padding:1em} padding 1em ...

{p2}hey! it\'s  &#917; <span class="h">&#8721;</span>

[%
Begin
  Replace p:p by s:s for j;
End
%]
                                    `,
                                    dat:"2015-03-25T20:24:00.000Z",
                                    obj:"PAGE",
                                    parent_auth_cd:4},
                                   {id:"F_INX_1426614762712_ARTICLE",
                                    title:"F Index",
                                    text:`
[%
create index APP.I_STRATEGY_IDX on APP.STRATEGY("STRATEGY_ID","PARAMETER")
 tablespace APP_CONFIG online;
%]
Disable profile %SYS_SQLPROF_033738dhf49d990% for delete on strategy
[%
BEGIN
  DBMS_SQLTUNE.alter_sql_profile (
      name            => 'SYS_SQLPROF_033738dhf49d990',
      attribute_name  => 'STATUS',
      value           => 'DISABLED');
END;
%]
`,
                                    dat:"2015-03-25T20:24:00.000Z",
                                    obj:"NAME",
                                    parent_auth_cd:4},
                                  ]
                          };
    //
    //console.log(pageDemo);
    pageDataArray.push(new pageData(pageDemo));
    return pageDataArray;
  }
}
