import { ConfirmationHotelComponent } from './Components/confirmation-hotel/confirmation-hotel.component';
import { HotelsPreConfirmationComponent } from './Components/hotels-pre-confirmation/hotels-pre-confirmation.component';
import { HotelCheckOutComponent } from './Components/hotel-check-out/hotel-check-out.component';
import { HotelCancelationComponent } from './Components/hotel-rooms/hotel-cancelation/hotel-cancelation.component';
import { HotelRoomsComponent } from './Components/hotel-rooms/hotel-rooms.component';
import { HotelResultComponent } from './Components/hotel-result/hotel-result.component';
import { LimitToPipe } from './pipes/limit-to.pipe';
import { HotelecitesPipe } from './pipes/hotelecites.pipe';
import { DirConfirmationComponent } from './Components/dir-confirmation/dir-confirmation.component';

//angular Imports Start//
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes, NoPreloading, PreloadAllModules} from '@angular/router';
//angular import End //

//Component Import start//
import { AppComponent } from './app.component';
import { SearchResultComponent } from './Components/search-result/search-result.component';
import {HeadderComponent} from './Components/headder/headder.component';
import { BestOffersComponent } from './Components/best-offers/best-offers.component';
//Component Tmport end//

//Services Import start//
import { MyApiService } from './Services/my-api.service';
//Services Import end//

//pipes Import start //
import { FilterCityPipe } from './pipes/filter-city.pipe';
import { DatePipe } from '@angular/common';
import { HourMinutePipe } from './pipes/hour-minute.pipe';
import { DurationToHourMinPipe } from './pipes/duration-to-hour-min.pipe';
//pipes Import end//
//other libraries statr //
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material';
import {MatButtonModule} from '@angular/material/button';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {NewSearchComponent } from './Components/new-search/new-search.component';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import {MatChipsModule} from '@angular/material/chips';      
import {MatSelectModule} from '@angular/material/select';
import {MatMenuModule} from '@angular/material/menu';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatStepperModule} from '@angular/material/stepper';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatExpansionModule} from '@angular/material/expansion';
// import ngx-translate and the http loader
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient} from '@angular/common/http';
import { TopDestinationComponent } from './Components/top-destination/top-destination.component';

import { Ng5SliderModule } from 'ng5-slider';
import { ResearchComponent } from './Components/research/research.component';
import { CheckoutComponent } from './Components/checkout/checkout.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { BsDropdownModule } from 'ngx-bootstrap';
import { CouncodePipe } from './pipes/councode.pipe';
import { ConfirmationComponent } from './Components/confirmation/confirmation.component';
import { PreConfirmationComponent } from './Components/pre-confirmation/pre-confirmation.component';
import { BestOffersDetailsComponent } from './Components/best-offers/best-offers-details/best-offers-details.component';
import { MultiResultCardComponent } from './Components/multi-result-card/multi-result-card.component';
import { NormalerrorComponent } from './Components/normalerror/normalerror.component';
import { PaymentErorrComponent } from './Components/payment-erorr/payment-erorr.component';
import { CodToCityPipe } from './pipes/cod-to-city.pipe';
import { InsuranceComponent } from './Components/insurance/insurance.component';
import { FooterComponent } from './Components/footer/footer.component';
import { ExchangePipe } from './pipes/exchange.pipe';
import { AboutUsComponent } from './Components/about-us/about-us.component';
import { ContactComponent } from './Components/contact/contact.component';
import { FareRulesComponent } from './Components/fare-rules/fare-rules.component';
import { HotelSearchComponent } from './Components/hotel-search/hotel-search.component';
import { ContactusCOntainerComponent } from './Components/contactus-container/contactus-container.component';
import { UsersComponent } from './Components/users/users.component';
import { UserLoginComponent } from './Components/users/user-login/user-login.component';
import { UserSignupComponent } from './Components/users/user-signup/user-signup.component';
import { TermOfuseComponent } from './Components/term-ofuse/term-ofuse.component';
import { PrivacyComponent } from './Components/privacy/privacy.component';
import { ForgetPasswordComponent } from './Components/users/forget-password/forget-password.component';
import { ChangePasswordComponent } from './Components/users/change-password/change-password.component';
import { UpcomingAhistoryComponent } from './Components/users/upcoming-ahistory/upcoming-ahistory.component';
import { HotelresearchComponent } from './Components/hotelresearch/hotelresearch.component';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgxGalleryModule } from 'ngx-gallery';
import { HotelDetailsComponent } from './Components/hotel-result/hotel-details/hotel-details.component';
 const routes :Routes =
//  language,currency,SearchPoint,flightType,flightInfo,searchId,passengers,Cclass,directOnly
  [
   { path:'',component:NewSearchComponent},
   { path:'ResultPage',component:SearchResultComponent},
   { path:'ResultPage/:language/:currency/:SearchPoint/:flightType/:flightInfo/:searchId/:passengers/:Cclass/:directOnly',component:SearchResultComponent},
   { path:'ResultPage1/:language/:currency/:SearchPoint/:flightType/:flightInfo/:searchId/:passengers/:Cclass/:directOnly',component:SearchResultComponent},
   { path:'checkout',component:CheckoutComponent},
   { path:'checkout/:sid/:sequenceNum',component:CheckoutComponent},
   { path:'confirmation',component:ConfirmationComponent},
   { path:'confirmation/:HGNum/:sid',component:ConfirmationComponent},
   { path:'paymentresult',component:PreConfirmationComponent},
  //  { path:'paymentConfirm',component:DirConfirmationComponent},
   { path :'bestoffers',component:BestOffersDetailsComponent},
   { path :'bestoffers/:id/:pos',component:BestOffersDetailsComponent},
   {path :'insurance',component:InsuranceComponent},
   {path :'aboutUs',component:AboutUsComponent},
   {path : 'Contact',component:ContactusCOntainerComponent},
   {path : 'terms/:sid/:sequenceNum',component:FareRulesComponent},
   {path:'hotel',component:HotelSearchComponent},
   {path:'login',component:UserLoginComponent},
   {path:'signup',component:UserSignupComponent},
   {path:'termsOfuse',component:TermOfuseComponent},
   {path:'privacyPolicy',component:PrivacyComponent},
   {path:'forgetPassword',component:ForgetPasswordComponent},
   {path:'error',component:NormalerrorComponent},
   {path:'orders',component:UpcomingAhistoryComponent},
   {path:"hotelResult/:language/:currency/:SearchPoint/:searchId/:location/:citywithcountry/:nation/:checkIn/:checkOut/:roomNumber/:stringGuest",component:HotelResultComponent},
  //  {path:"hotelResult",component:HotelResultComponent},
  //  hotelRoom
  {path:'rooms',component:HotelRoomsComponent},
  {path:'hotelcheckout',component:HotelCheckOutComponent},
  {path:"hotel-paymentresult",component: HotelsPreConfirmationComponent},
  {path:"confirmation-hotel",component:ConfirmationHotelComponent},

  // {path:'paymentResult2',component:DirConfirmationComponent}
  // {path:"payementerror",component:PaymentErorrComponent},


  ]

//other libraries end//
@NgModule({
  declarations: [
    AppComponent,
    SearchResultComponent,
    NewSearchComponent,
    FilterCityPipe,
    HeadderComponent,
    BestOffersComponent,
    TopDestinationComponent,
    HourMinutePipe,
    DurationToHourMinPipe,
    ResearchComponent,
    CheckoutComponent,
    CouncodePipe,
    ConfirmationComponent,
    PreConfirmationComponent,
    BestOffersDetailsComponent,
    MultiResultCardComponent,
    NormalerrorComponent,
    PaymentErorrComponent,
    CodToCityPipe,
    InsuranceComponent,
    FooterComponent,
    ExchangePipe,
    LimitToPipe,
    HotelecitesPipe,
    AboutUsComponent,
    ContactComponent,
    FareRulesComponent,
    HotelSearchComponent,
    ContactusCOntainerComponent,
    UsersComponent,
    UserLoginComponent,
    UserSignupComponent,
    TermOfuseComponent,
    PrivacyComponent,
    ForgetPasswordComponent,
    ChangePasswordComponent,
    UpcomingAhistoryComponent,
    DirConfirmationComponent,
    HotelResultComponent,
    HotelresearchComponent,
    HotelDetailsComponent,
    HotelRoomsComponent,
    HotelCancelationComponent,
    HotelCheckOutComponent,
    HotelsPreConfirmationComponent,
    ConfirmationHotelComponent

  ],
  imports: [
   //angular imports
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(
      routes
      ,{scrollPositionRestoration: 'enabled',
      preloadingStrategy:PreloadAllModules}),
    //other imports
    BsDropdownModule.forRoot(),
    NgxIntlTelInputModule,
    MatFormFieldModule,
    MatRadioModule,
    Ng5SliderModule,
    MatCheckboxModule,
    MatChipsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatIconModule,
    MatTabsModule,
    MatSelectModule,
    MatMenuModule,
    MatProgressBarModule,
    MatStepperModule,
    MatExpansionModule,
    NgbModule,
    VirtualScrollerModule,
    LazyLoadImageModule,
    NgxGalleryModule,
    // configure the imports
    HttpClientModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    })
    
  ],
  providers: [MyApiService,DatePipe,MatDatepickerModule],
  bootstrap: [AppComponent],
  entryComponents: [HotelCancelationComponent]
})
export class AppModule { }
// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
