
// Object.assign(new Foo, { a: 1 })
// Object.setPrototypeOf({ a: 1 }, Foo.prototype)

class FCCustInfo {


  getCustInfo() {

    return {
      "identificationCardType": "CITIZEN_CARD",
      "cardNumber": "1349900472239",
      "cardExpiryDate": "20220329",
      "accompanyingDocument": "CITIZEN_CARD",
      "gender": "Female",
      "title": "MISS",
      "enFirstName": "Thanunya",
      "enLastName": "Chaiyaocha",
      "thFirstName": "ธนันท์ยา",
      "thLastName": "ไชยโอชะ",
      "birthDate": "19920330",
      "nationality": "TH",
      "mobileNumber": "0902433456",
      "email": "author1_nam@hotmail.com",
      "maritalStatus": "Single",
      "spouse": {},
      "occupationId": 50,
      "occupationOther": null,
      "businessTypeId": 180,
      "businessTypeOther": "ไม่ระบุ",
      "monthlyIncomeLevel": "LEVEL1",
      "incomeSource": "SAVINGS",
      "incomeSourceOther": null,
      "residence": {
          "no": "264 ม.6",
          "floor": null,
          "building": null,
          "soi": null,
          "road": null,
          "moo": null,
          "subdistrict": "เขมราฐ",
          "district": "เขมราฐ",
          "province": "อุบลราชธานี",
          "postalCode": "34170",
          "country": "TH",
          "phoneNumber": null
      },
      "companyName": null,
      "committedMoneyLaundering": false,
      "politicalRelatedPerson": false,
      "rejectFinancialTransaction": false,
      "confirmTaxDeduction": true,
      "canAcceptFxRisk": false,
      "canAcceptDerivativeInvestment": false,
      "suitabilityRiskLevel": 5,
      "suitabilityEvaluationDate": "20171106",
      "suitability": null,
      "fatca": false,
      "fatcaDeclarationDate": "20171106",
      "cddScore": 1,
      "cddDate": "20171106",
      "referralPerson": null,
      "applicationDate": "20170202",
      "incomeSourceCountry": "TH",
      "acceptedBy": "Anucha Yangthaisong",
      "children": [],
      "openFundConnextFormFlag": false,
      "accounts": [
          {
              "identificationCardType": "CITIZEN_CARD",
              "cardNumber": "1349900472239",
              "accountId": "1349900472239",
              "icLicense": "053822",
              "accountOpenDate": "20170202",
              "investmentObjective": "PleaseSpecify",
              "investmentObjectiveOther": "ไม่ระบุ",
              "mailingAddressSameAsFlag": "Other",
              "subscriptionBankAccounts": [],
              "redemptionBankAccounts": [],
              "openOmnibusFormFlag": null
          }
      ],
      "workAddressSameAsFlag": "Residence",
      "vulnerableFlag": null,
      "vulnerableDetail": null,
      "ndidFlag": false,
      "ndidRequestId": null,
      "contact": {
          "no": "264 ม.6",
          "floor": null,
          "building": null,
          "soi": null,
          "road": null,
          "moo": null,
          "subdistrict": "เขมราฐ",
          "district": "เขมราฐ",
          "province": "อุบลราชธานี",
          "postalCode": "34170",
          "country": "TH",
          "phoneNumber": "0902433456"
      }
  }
  }

}

module.exports = FCCustInfo;

