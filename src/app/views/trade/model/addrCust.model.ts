export class AddrCustModel {

  public Addr_Seq: number; // 1:register addr; 2:current addr ; 3:work addr
  public Addr_No: string;
  public Moo: string;
  public Place: string;
  public Floor: string;
  public Soi: string;
  public Road: string;
  public Tambon_Id: number;
  public Amphur_Id: number;
  public Province_Id: number;
  public Country_Id: number;
  public Country_oth: string;
  public Zip_Code: string;
  public Print_Address: string;
  public Tel: string;
  public Fax: string;

  public SameAs: string;
  public ReqModifyFlag: boolean;

  public CreateBy: string;
  public CreateDate: string;
  public UpdateBy: string;
  public UpdateDate: string;

  constructor(){}

}
