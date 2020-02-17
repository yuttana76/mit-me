import { Component, OnInit } from '@angular/core';
// import { Apollo, QueryRef } from 'apollo-angular';
// import gql from 'graphql-tag';

// Example
// https://developer.okta.com/blog/2018/11/30/web-app-with-express-angular-graphql

// const RANKINGS_QUERY = gql`
//   query rankings($rank: Int!) {
//     rankings(rank: $rank) {
//       date
//       rank
//       points
//       player {
//         first_name
//         last_name
//       }
//     }
//   }

//   {
//     account(Cust_Code: "0105540043706") {
//       Cust_Code
//       First_Name_T
//       Last_Name_T
//     }
//   }

// `;

@Component({
  selector: 'app-test-graph-ql',
  templateUrl: './test-graph-ql.component.html',
  styleUrls: ['./test-graph-ql.component.scss']
})
export class TestGraphQLComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
