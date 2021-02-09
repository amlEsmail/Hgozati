
export class CurrencyModule { 
  constructor(
    public ID:number,
    public Currency_Code:string,
    public Currency_Name:string,
    public Is_Base_Currency:string,
    public Image_Url:string,
    public rate : number
  ){}
}
