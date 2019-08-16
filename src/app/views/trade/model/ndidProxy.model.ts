import { ndidIdp } from "./ndidIdp.model";
import { ndidService } from "./ndidService.model";
import { ndidAS } from "./ndidAS.model";
import { ndidVeriReqDataRS } from "./ndidVeriReqData.model";

export class ndidProxy{

  constructor() {}
  token:string;
  idp: ndidIdp;
  service: ndidService;
  AS: ndidAS;
  veriReqDataRS: ndidVeriReqDataRS;

  //Verify
  namespace:string;
  identifier:string;
  request_message:string;
  min_ial:number;
  min_aal :number;
  min_idp:number;
  callback_url:string;
  mode:number;
  min_as:number;
  request_params:string;

  //Verify RS & data
  service_id:string;
  source_node_id: string;
  data:string;

}
