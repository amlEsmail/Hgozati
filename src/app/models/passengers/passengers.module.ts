
import { PassengerinfoModule } from '../passengerinfo/passengerinfo.module';


export class PassengersModule { 
  constructor (
    public bookingEmail:string,
    public UserCurrency:string,
    public passengersDetails:PassengerinfoModule[
    ]
  ){}
}
