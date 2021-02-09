// this model contain cities out put
export class HotelsCitiesModule {
  constructor(
    public CityId: number,
    public City: string,
    public Country: string,
    public CityWithCountry: string
  ) {

  }
}
