export interface FlightSearchResult {
    airlines:any[]
  status: string
  searchCriteria:{
    adultNum:number,
    childNum:number,
    currency:string,
    flights:[
      {
        arrivingTo:string
        departingFrom:string
        departingOnDate:any
      },{
        arrivingTo:string
        departingFrom:string
        departingOnDate:any
      },{
        arrivingTo:string
        departingFrom:string
        departingOnDate:any
      },{
        arrivingTo:string
        departingFrom:string
        departingOnDate:any
      }
    ],
    flightType:string,
    infantNum:string,
    language:string,
    pos:string,
    preferredAirline:any,
    searchId:string,
    selectDirectFlightsOnly:boolean,
    selectedFlightClass:string,
    source:string,
    totalPassengersNum:number
  }
      airItineraries: [
        {
          sequenceNum: number,
          isRefundable: boolean,
          itinTotalFare: {
            amount: any,
            currencyCode: string,
            totalTaxes: any
          },
          totalDuration: any,
          deptDate: string,
          arrivalDate: string,
          cabinClass: string,
          flightType: string,
          allJourney: {
            flights: [
              {
                flightDTO: [
                  {
                    isStopSegment: true,
                    deptTime: any,
                    landTime: any,
                    departureDate: any,
                    arrivalDate: any,
                    flightAirline: {
                      airlineCode: any,
                      airlineName: string,
                      airlineLogo: any,
                      alternativeBusinessName: any,
                      languageCode: string,
                      passportDetailsRequired: any,
                      airlineClass: any
                    },
                    operatedAirline: {
                      airlineCode: any,
                      airlineName: string,
                      airlineLogo: any,
                      alternativeBusinessName: string,
                      languageCode: string,
                      passportDetailsRequired: any,
                      airlineClass: string
                    },
                    durationPerLeg: any,
                    departureTerminalAirport: {
                      airportCode: any,
                      airportName: string,
                      cityName: string,
                      cityCode: string,
                      countryCode: string,
                      countryName: string,
                      regionName: string,
                    },
                    arrivalTerminalAirport: {
                      airportCode: any,
                      airportName: string,
                      cityName: string,
                      cityCode: string,
                      countryCode: any,
                      countryName: string,
                      regionName: any

                    },
                    transitTime: any,
                    flightInfo: {
                      flightNumber: any,
                      equipmentNumber: any,
                      mealCode: any,
                      bookingCode: any,
                      cabinClass: string
                    },
                    segmentDetails: {
                      uniqueKey: any,
                      baggage: any,
                      childBaggage: any,
                      infantBaggage: any,
                    }
                  }
                ]

              }
            ]
          },
          baggageInformation: [
            {
              baggage: string,
              childBaggage: any,
              infantBaggage: any,
              airlineName: string,
              deptCity: string,
              landCity: string,
              flightNum: any
            }
          ]
         

        }],
        passengersDetails:any[]

}

