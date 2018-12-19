import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { from } from 'rxjs/observable/from';
import { filter } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

//     // emit ({name: 'Joe', age: 31}, {name: 'Bob', age:25})
// const source = from([{ name: 'Joe', age: 31 }, { name: 'Bob', age: 25 }]);
// // filter out people with age under 30
// const example = source.pipe(filter(person => person.age >= 30));
// // output: "Over 30: Joe"
// const subscribe = example.subscribe(val => console.log(`Over 30: ${val.name}`));

  }
}
