import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { NgxTagifyComponent, TagifySettings } from '@rynangeles/ngx-tagify';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('tagify') tagify: NgxTagifyComponent;
  form: FormGroup;
  public tagifyWhitelist: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public tagifySettings: TagifySettings = {
    mode: 'mix',
    pattern: /@|#|-/,
    duplicates: true,
    editTags: false,
    mixMode: {
      insertAfterTag: ''
    },
    dropdown: {
      enabled: 0,
      maxItems: 10,
      position: 'text',
      mapValueTo: 'label',
      highlightFirst: true
    }
  };

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      tagify: ['', Validators.required],
      tagifyMix: ['', Validators.required]
    });
  }

  ngAfterViewInit() {
    const headers = new HttpHeaders().set('app-id', '603d47a694aa9d08e4129109');
    const params = new HttpParams({ fromObject: { limit: '50' } });
    this.http.get<{ data: any[] }>('https://dummyapi.io/data/api/tag', { params, headers })
      .pipe(map(({ data }) => data.map((item, i) => ({ key: i < 26 ? '@' : '#', value: `{{${item}}}`, label: item })))).subscribe(this.tagifyWhitelist);
  }

  tagifyChange(evt) {
    if (evt.type === 'input') {
      const { prefix, tagify } = evt.detail;
      if (prefix) {
        tagify.settings.whitelist = this.tagifyWhitelist.value.filter(({ key }) => key === prefix);
      }
    }
  }

  onSubmit() {}
}
