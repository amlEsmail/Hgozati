export class FilterInputsModule { 
  constructor(
    public priceMin:number,
    public priceMax:number,
    public durationMin:number,
    public durationMax:number,
    public depatingMin:number,
    public departingMax:number,
    public returnMin:number,
    public returnMax:number,
    public stops:number[],
    public airlines:string[] 
  ){

  }
}
