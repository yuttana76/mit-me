export class Anoucement {

  id: string;
  Topic: string;
  AnouceFrom: string;
  Catgory: string;
  status: string;
  AnouceType: string;
  AnouceDate: string;
  SourceType: string;
  SourcePath: string;
  SourceContent: string;
  CreateBy: string;
  CreateDate: string;
  UpdateBy: string;
  UpdateDate: string;

  constructor(_Topic: string, _AnouceFrom: string, _Category: string, _status: string
    , _AnouceType: string, _AnouceDate: string, _SourceType: string, _SourcePath: string
    , _SourceContent: string) {
    this.Topic = _Topic;
    this.AnouceFrom = _AnouceFrom;
    this.Catgory = _Category;
    this.status = _status;
    this.AnouceType = _AnouceType;
    this.AnouceDate = _AnouceDate;
    this.SourceType = _SourceType;
    this.SourcePath = _SourcePath;
    this.SourceContent = _SourceContent;
  }

}
