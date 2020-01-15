import { PersonModel } from "./person.model";

export class CDDModel {

      // public modifyFlag: string;

      public identificationCardType: string;
      public passportCountry: string;

      public pid: string;
      public title: string;
      public titleOther: string;

      public firstName: string;
      public lastName: string;

      public firstNameE: string;
      public lastNameE: string;

      public dob: string;
      public mobile: string;
      public email: string ;
      public nationality: string;
      public occupation: string;
      public occupation_Oth: string;

      public position: string;
      public position_Oth: string;

      public typeBusiness: string;
      public typeBusiness_Oth: string;

      public incomeLevel: string;
      public incomeSource: string;
      public incomeSourceList: string[] =[""];
      public incomeSource_Oth: string;

      public incomeCountry: string;
      public incomeCountry_Oth: string;
      public workPlace: string;

      public ReqModifyFlag: boolean;
      public PIDExpDate: string;
      public MailSameAs: string;


      public maritalStatus: string;
      // public spouseCardType: string;
      // public spousePassportCountry: string;
      // public spouseCardNumber: string;
      // public spouseTitle: string;
      // public spouseTitleOther: string;
      // public spouseFirstName: string;
      // public spouseLastName: string;
      // public spouseIDExpDate: string;
      // public SpouseIDNotExp: string;

      public moneyLaundaring: string;
      public politicalRelate: string;
      public rejectFinancial: string;
      public taxDeduction: string;
      public cardNotExp: string;
      public cardNotExpBol: boolean;
      public numChildren: string;
      public cddScore: string;
      public cddDate: string;

      public SPpersonModel:PersonModel = new PersonModel();
      public children: PersonModel[] =[];

      constructor(){}

}
