import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit{

  public countriesByRegion:SmallCountry[]=[];
  public borders:SmallCountry[] =[];
  constructor(private fb:FormBuilder,
    private countriesService:CountriesService){}

  ngOnInit(): void {
    this.onRegionChanged();
    this.onCountryChanged();
  }

  onRegionChanged(){
    this.myForm.get('region')!.valueChanges
    .pipe(
      tap(()=>this.myForm.get('country')!.setValue('')),
      tap(() => this.borders=[]),
      switchMap(region => this.countriesService.getCountriesByRegion(region))
      )
    .subscribe(countries =>{
      this.countriesByRegion=countries;
      // console.log({countries})
    });
  }

  public myForm:FormGroup=this.fb.group({
    region:['',Validators.required],
    country:['',Validators.required],
    border:['',Validators.required],
  })

  get regions():Region[]{
    return this.countriesService.regions;
  }

  onCountryChanged():void{
    this.myForm.get('country')!.valueChanges
    .pipe(
      tap(()=>this.myForm.get('border')!.setValue('')),
      filter((value: string) => {
        console.log('value:', value); // Agregar el console.log aquí

        return value.length > 0;
      }),
      // filter((value:string) => value.length >0),
      // switchMap((alphaCode) => this.countriesService.getCountryByAlphaCode(alphaCode)),
      switchMap((alphaCode) => {
        console.log('alphaCode:', {alphaCode}); // Agregar el console.log aquí

        return this.countriesService.getCountryByAlphaCode(alphaCode);
      }),
      switchMap((country) => this.countriesService.getCountryBordersByCodes(country.borders)),
      )
    .subscribe(countries =>{
      this.borders=countries;
      // console.log({countries})
    });
  }
}
