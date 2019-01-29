export class Fund {
  fundCode: string;
  thaiName: string;
  engName: string;
  Amc_Id: string;

  constructor(_fundCode: string , _thaiName: string, _engName: string, _Amc_Id: string) {
    this.fundCode = _fundCode;
    this.thaiName = _thaiName;
    this.engName = _engName;
    this.Amc_Id = _Amc_Id;
  }
}
