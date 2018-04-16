import { Pipe, PipeTransform } from '@angular/core';
//
// Example: Filter an Array of JSON objects.
//
//  Usage: <div *ngFor="let funktion of menuDataService.menu_f | filterObject: 'ba_id' : 'HOME' " >
//
//  Data: [{"ba":"Home",
//          "ba_id":"HOME",
//          "ba_seq":1,
//          "f":"Notes",
//          "f_id":"NOTES",
//          "f_url":"#/page/NOTES_PAGE",
//          "f_seq":1,
//          "authlevel":4},
//         {"ba":"Business",
//          "ba_id":"BUSINESS",
//          "ba_seq":2,
//          "f":"Topic",
//          "f_id":"TOPIC",
//          "f_url":"#/page/TOPIC_PAGE",
//          "f_seq":1,
//          "authlevel":4}
//          ]
//
//  Results in only returning the row with ba_id:HOME. i.e.: funktion.f == Notes
//
@Pipe({
    name: 'filterObject',
    pure: false
})
export class FilterObjectPipe implements PipeTransform {
  transform(items: any[], field: string, value: string): any[] {
    if (!items) return [];
    return items.filter(it => it[field] == value);
  }
}
