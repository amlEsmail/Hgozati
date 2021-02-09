
export class PointOfsaleModule {
  constructor(
    public ip:string,
    public city:string,
    public region:string,
    public region_code:string,
    public country:string,
    public country_name:string,
    public continent_code:string,
    public in_eu:boolean,
    public postal:any,
    public latitude:number,
    public longitude:number,
    public timezone:string,
    public utc_offset:string,
    public country_calling_code:string,
    public currency:string,
    public languages:string,
    public asn:string,
    public org:string
  ){
  }
 }
