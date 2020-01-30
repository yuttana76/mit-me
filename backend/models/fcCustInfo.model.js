
// Object.assign(new Foo, { a: 1 })
// Object.setPrototypeOf({ a: 1 }, Foo.prototype)

class FCCustInfo {


  getCustInfo() {

    return {
      "identificationCardType": "CITIZEN_CARD",
      "cardNumber": "3100200646897",
      "cardExpiryDate": "20250402",
      "accompanyingDocument": "CITIZEN_CARD",
      "gender": "Male",
      "title": "MR",
      "enFirstName": "Somboom",
      "enLastName": "Rudeeaneksin",
      "thFirstName": "สมบูรณ์",
      "thLastName": "ฤดีอเนกสิน",
      "birthDate": "19710403",
      "nationality": "TH",
      "mobileNumber": "0847003892",
      "email": "Somboon@merchant.co.th",
      "maritalStatus": "Single",
      "spouse": {},
      "occupationId": 40,
      "occupationOther": null,
      "businessTypeId": 30,
      "businessTypeOther": null,
      "monthlyIncomeLevel": "LEVEL4",
      "incomeSource": "SALARY",
      "incomeSourceOther": null,
      "residence": {
          "no": "942/81",
          "floor": "2",
          "building": "ชาญอิสสระทาวเวอร์ 1",
          "soi": null,
          "road": "พระราม 4",
          "moo": null,
          "subdistrict": "สุริยวงศ์",
          "district": "บางรัก",
          "province": "กรุงเทพมหานคร",
          "postalCode": "10500",
          "country": "TH",
          "phoneNumber": null
      },
      "companyName": "บริษัทหลักทรัพย์จัดการกองทุน เมอร์ชั่น พาร์ทเนอร์ จำกัด",
      "committedMoneyLaundering": false,
      "politicalRelatedPerson": false,
      "rejectFinancialTransaction": false,
      "confirmTaxDeduction": true,
      "canAcceptFxRisk": true,
      "canAcceptDerivativeInvestment": true,
      "suitabilityRiskLevel": 3,
      "suitabilityEvaluationDate": "20200101",
      "suitability": {
          "suitNo1": "2",
          "suitNo2": "4",
          "suitNo3": "3",
          "suitNo4": [
              4
          ],
          "suitNo5": "3",
          "suitNo6": "3",
          "suitNo7": "3",
          "suitNo8": "3",
          "suitNo9": "4",
          "suitNo10": "4",
          "suitNo11": "2",
          "suitNo12": "2"
      },
      "fatca": false,
      "fatcaDeclarationDate": "20190410",
      "cddScore": 2,
      "cddDate": "20190410",
      "referralPerson": "MPAM_SYSTEM",
      "applicationDate": "20110607",
      "incomeSourceCountry": "TH",
      "acceptedBy": "Tananya 039583",
      "children": [],
      "openFundConnextFormFlag": true,
      "accounts": [
          {
              "identificationCardType": "CITIZEN_CARD",
              "cardNumber": "3100200646897",
              "accountId": "3100200646897",
              "icLicense": "039583",
              "accountOpenDate": "20110607",
              "investmentObjective": "ShortTermInvestment",
              "investmentObjectiveOther": "ไม่ระบุ",
              "approvedDate": "20190410",
              "mailingAddressSameAsFlag": "Email",
              "subscriptionBankAccounts": [
                {
                "bankCode":"0001",
                "bankBranchCode":"10001",
                "bankAccountNo":"123",
                "default":false,
                "finnetCustomerNo":""
              },
              {
                "bankCode":"0002",
                "bankBranchCode":"20002",
                "bankAccountNo":"123-0002",
                "default":true,
                "finnetCustomerNo":""
              },
            ],
              "redemptionBankAccounts": [
                {
                  "bankCode":"0001",
                  "bankBranchCode":"10001",
                  "bankAccountNo":"123",
                  "default":true,
                  "finnetCustomerNo":""
                },

              ],
              "openOmnibusFormFlag": null
          }
      ],
      "vulnerableFlag": false,
      "vulnerableDetail": "",
      "ndidFlag": false,
      "ndidRequestId": null,
      "work": {
          "no": "942/81",
          "floor": "2",
          "building": "ชาญอิสสระทาวเวอร์ 1",
          "soi": null,
          "road": "พระราม 4",
          "moo": null,
          "subdistrict": "สุริยวงศ์",
          "district": "บางรัก",
          "province": "กรุงเทพมหานคร",
          "postalCode": "10500",
          "country": "TH",
          "phoneNumber": null
      },
      "contact": {
          "no": "17/4",
          "floor": null,
          "building": null,
          "soi": null,
          "road": "ประชาราษฎร์ 2",
          "moo": null,
          "subdistrict": "บางซื่อ",
          "district": "บางซื่อ",
          "province": "กรุงเทพฯ",
          "postalCode": "10800",
          "country": "TH",
          "phoneNumber": null
      }
  }
  }

}

module.exports = FCCustInfo;

