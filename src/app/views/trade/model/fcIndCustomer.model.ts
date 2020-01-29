import { AddrCustModel } from "./addrCust.model";
import { Country } from "./ref_country";
import { Suitability } from "./suitability.model";
import { PersonModel } from "./person.model";
import { BankAccountModel } from "./bankAccount.model";


export class fcIndCustomer{

  constructor() {}

  identificationCardType: string;
  passportCountry: string;
  cardNumber: string;
  // cardExpiryDate: Date;
  // "19831231
  // N/A"
  cardExpiryDate: string;
  accompanyingDocument: string;
  gender: string;
  title: string;
  titleOther: string;
  enFirstName: string;
  enLastName: string;
  thFirstName: string;
  thLastName: string;
  birthDate:Date;
  nationality: string;
  mobileNumber: string;
  email: string;
  maritalStatus: string;
  // spouse:Spouse;
  occupationId: string;
  occupationOther: string;
  businessTypeId: string;
  businessTypeOther: string;
  monthlyIncomeLevel: string;
  // incomeSource: string;
  public incomeSource: string[] =[""];
  incomeSourceOther: string;
  residence :AddrCustModel;
  currentAddressSameAsFlag:String;
  current:AddrCustModel;
  companyName:String;
  workAddressSameAsFlag:String;
  work:AddrCustModel
  committedMoneyLaundering:boolean;
  politicalRelatedPerson:boolean;
  rejectFinancialTransaction:boolean;
  // confirmTaxDeduction
  canAcceptFxRisk:boolean;
  canAcceptDerivativeInvestment:boolean;
  suitabilityRiskLevel:string;
  suitabilityEvaluationDate:Date;
  fatca:boolean;
  fatcaDeclarationDate:Date;
  cddScore:String;
  cddDate:Date;
  referralPerson:String;
  applicationDate:Date;
  incomeSourceCountry:Country;
  acceptBy:String;
  // children:Child;
  openFundConnextFormFlag:boolean;
  approved:boolean;
  vulnerableFlag :boolean;
  vulnerableDetail:string;
  ndidFlag:boolean;
  ndidRequestId:string;
  suitability:Suitability;
  accountType: string;
  public MailSameAs: string;
  public moneyLaundaring: string;
  public politicalRelate: string;
  public rejectFinancial: string;

  public spouse:PersonModel = new PersonModel();
  public children: PersonModel[] =[];

  public re_addrData: AddrCustModel = new AddrCustModel();
  public cu_addrData: AddrCustModel = new AddrCustModel();
  public wk_addrData: AddrCustModel = new AddrCustModel();
  public mail_addrData: AddrCustModel = new AddrCustModel();

  investmentObjective: string[] =[""];
  investmentObjectiveOther: string;

  public subscriptionBankAccounts: BankAccountModel[]=[];
  public redemptionBankAccounts: BankAccountModel[]=[];
  public redemptionkAccountsSameAs: string;



}
