export class Anoucement {

  Topic: string;
  AnouceFrom: string;
  AnouceType: string;
  AnouceDate: string;
  SourceType: string;
  SourceLink: string;
  SourceContent: string;

  constructor(_Topic: string, _AnouceFrom: string, _AnouceType: string, _AnouceDate: string, _SourceType: string, _SourceLink: string
    , _SourceContent: string) {
    this.Topic = _Topic;
    this.AnouceFrom = _AnouceFrom;
    this.AnouceType = _AnouceType;
    this.AnouceDate = _AnouceDate;
    this.SourceType = _SourceType;
    this.SourceLink = _SourceLink;
    this.SourceContent = _SourceContent;
  }
}
