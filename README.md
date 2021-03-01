
# Ngx-tagify

  

Angular library that wraps [tagify](https://yaireo.github.io/tagify/) into a custom input field component that can be use both Template-driven and Reactive form.

  

## Demo

  

Check the demo site on how it works [https://rynangeles.github.io/ngx-tagify/](https://rynangeles.github.io/ngx-intelisearch/)

  

## Dependencies

  

This library has one dependency. [tagify](https://yaireo.github.io/tagify/).

  

## Installation

  

This library is published in Github Packages.

  

> npm install @rynangeles/ngx-tagify

  
  

### Import the module
> app.module.ts
```
import { NgxTagifyModule } from  '@rynangeles/ngx-tagify';

  

@NgModule({

imports: [

NgxTagifyModule

]

})

export class AppModule { }
```
  

## Usage

  

> app.component.html

  
```
<!--Simple-->
<ngx-tagify formControlName="tagify"  [whitelist]="tagifyWhitelist" (change)="tagifyChange($event)"></ngx-tagify>

<!--Mix-->
<ngx-tagify  #tagify=NgxTagify formControlName="tagifyMix" [settings]="tagifySettings [whitelist]="tagifyWhitelist" (change)="tagifyChange($event)"></ngx-tagify>
```
> app.component.ts

  ```
import { HttpClient, HttpHeaders, HttpParams } from  '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from  '@angular/core';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { BehaviorSubject } from  'rxjs';
import { NgxTagifyComponent, TagifySettings } from  '@rynangeles/ngx-tagify';
import { map } from  'rxjs/operators';

@Component({
	selector:  'app-root',
	templateUrl:  './app.component.html',
	styleUrls: ['./app.component.scss']
})
export  class  AppComponent  implements  OnInit, AfterViewInit {
@ViewChild('tagify') tagify: NgxTagifyComponent;
form: FormGroup;
public  tagifyWhitelist: BehaviorSubject<any[]> = new  BehaviorSubject([]);
public  tagifySettings: TagifySettings = {
	mode:  'mix',
	pattern: /@|#|-/,
	duplicates:  true,
	editTags:  false,
	mixMode: {
		insertAfterTag:  ''
	},
	dropdown: {
		enabled:  0,
		maxItems:  10,
		position:  'text',
		mapValueTo:  'label',
		highlightFirst:  true
	}
};

constructor(
	private  formBuilder: FormBuilder,
	private  http: HttpClient,
) { }

ngOnInit() {
	this.form = this.formBuilder.group({
		tagify: ['', Validators.required],
		tagifyMix: ['', Validators.required]
	});
}

ngAfterViewInit() {
	const  headers = new  HttpHeaders().set('app-id', '603d47a694aa9d08e4129109');
	const  params = new  HttpParams({ fromObject: { limit:  '50' } });
	this.http.get<{ data: any[] }>('https://dummyapi.io/data/api/tag', { params, headers })
	.pipe(map(({ data }) =>  data.map((item, i) => ({ key:  i < 26 ? '@' : '#', value:  `{{${item}}}`, label:  item })))).subscribe(this.tagifyWhitelist);

}
  

tagifyChange(evt) {
	if (evt.type === 'input') {
		const { prefix, tagify } = evt.detail;
		if (prefix) {
		tagify.settings.whitelist = this.tagifyWhitelist.value.filter(({ key }) =>  key === prefix);
		}
	}
}

onSubmit() {}

}
```

## API

### Inputs

| | | |
|--|--|--|
| **name** | optional | Name of the instance. *type: String* |
| **settings** | optional | Settings specifically for [tagify.settings](https://github.com/yairEO/tagify#settings). type: TagifySettings |
| **whitelist** | optional/required for `mode:mix` | List of tags. *type: Observable<Array<Object \| String>>* |
| **required** | optional | Is the field required. *type: Boolean* |
| **comparison** | optional | List of comparison operators. *type: Observable<{value:any, label:string}[]* |

  

### Outputs

| | | |
|--|--|--|
| **add** | optional | Function triggered after tag has been added. |
| **remove** | optional | Function triggered after tag has been removed. |
| **change** | optional | Function triggered after something has changed. |