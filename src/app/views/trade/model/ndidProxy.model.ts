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

  service_id:string;
  source_node_id: string;

  //Verify
  namespace:string;
  identifier:string;
  request_message:string;
  min_ial:string;
  min_aal :string;
  min_idp:string;
  callback_url:string;
  mode:string;
  min_as:string;
  request_params:string;


}
