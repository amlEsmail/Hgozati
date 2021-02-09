export interface Bestoffers {
    "offers": [
        {
            "offerName": string,
            "offerDescription": string,
            "pos": string,
            "totalSellPrice": number,
            "startDate": string,
            "endDate": string,
            "currency": string,
            "offerImage": {
                "imageDescription":string,
                "url": string
            },
            "offerDays": [
                {
                    "dayDescription":string,
                    "dayDate": string,
                    "offerServices": [
                        {
                            "serviceType": string,
                            "serviceDescription": string,
                            "servicePrice": number,
                            "includedCities": [
                                {
                                    "cityCode": string,
                                    "cityName": string,
                                    "cityType": string
                                }
                            ],
                            "serviceImage": [
                                {
                                    "imageDescription": string,
                                    "url":string
                                }
                            ]
                        }
                    ]
                },
                {
                    "dayDescription": string,
                    "dayDate": string,
                    "offerServices": [
                        {
                            "serviceType": string,
                            "serviceDescription":string,
                            "servicePrice": number,
                            "includedCities": [
                                {
                                    "cityCode": string,
                                    "cityName": string,
                                    "cityType": string
                                }
                            ],
                            "serviceImage": [
                                {
                                    "imageDescription":string,
                                    "url": string
                                }
                            ]
                        }
                    ]
                },
                {
                    "dayDescription": string,
                    "dayDate": string,
                    "offerServices": [
                        {
                            "serviceType": string,
                            "serviceDescription": string,
                            "servicePrice": number,
                            "includedCities": [
                                {
                                    "cityCode": string,
                                    "cityName": string,
                                    "cityType": string
                                }
                            ],
                            "serviceImage": [
                                {
                                    "imageDescription": string,
                                    "url": string
                                }
                            ]
                        }
                    ]
                },
                {
                    "dayDescription": string,
                    "dayDate": string,
                    "offerServices": [
                        {
                            "serviceType":string,
                            "serviceDescription":string,
                            "servicePrice": number,
                            "includedCities": [
                                {
                                    "cityCode": string,
                                    "cityName": string,
                                    "cityType": string
                                }
                            ],
                            "serviceImage": [
                                {
                                    "imageDescription": string,
                                    "url": string
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}
