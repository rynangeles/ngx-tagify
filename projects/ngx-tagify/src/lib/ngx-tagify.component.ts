import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild, forwardRef, OnDestroy, ElementRef, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { fromEvent, merge, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Tagify, { TagifySettings } from '@yaireo/tagify'; 
export { TagData, TagifySettings } from '@yaireo/tagify';



const TAGIFY_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgxTagifyComponent),
  multi: true
};

@Component({
  selector: 'ngx-tagify',
  exportAs: 'NgxTagify',
  template: `<input #input [name]="name" [value]="value" />`,
  providers: [TAGIFY_VALUE_ACCESSOR]
})
export class NgxTagifyComponent implements AfterViewInit, ControlValueAccessor, OnDestroy {
  @Input() name: string;
  @Input() settings: TagifySettings;
  @Input() whitelist: Observable<Array<Object | String>>;
  @Input() required: boolean;

  @Output() add = new EventEmitter();
  @Output() remove = new EventEmitter();
  @Output() change = new EventEmitter();

  @ViewChild('input') eleRef: ElementRef;
  private _value: any = '';
  private _tagify;
  private notifier: Subject<any> = new Subject();
  private onChange: (value: any) => void;

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
    if (this.onChange) {
      this.onChange(value);
    }
  }

  get tagifyValue(){
    if(this._tagify){
      const { mode } = this._tagify.settings;
      return mode === 'mix' ? this._tagify.DOM.input.textContent :  this._tagify.value;
    }else{
      return null;
    }
  }

  private initTagify(settings) {
    this._tagify = new Tagify(this.eleRef.nativeElement, settings);

    this._tagify.on('input', (evt) => {
      this.value = this.tagifyValue;
      this.change.emit(evt);
    });

    merge(
      fromEvent(this._tagify, 'add'),
      fromEvent(this._tagify, 'remove'),
    )
      .pipe(takeUntil(this.notifier))
      .subscribe((event: CustomEvent) => {
        this.value = this.tagifyValue;
        this[event.type].emit(event);
      });
  }

  public loading(value: Boolean, term?: String) {
    this._tagify.loading(value).dropdown[value ? 'hide' : 'show'].call(this._tagify, term);
  }

  public setSetting(key: string, value: any) {
    this._tagify.settings[key] = value;
  }

  ngAfterViewInit() {
    this.initTagify(this.settings || {});
    if (this.whitelist) {
      this.whitelist
        .pipe(takeUntil(this.notifier))
        .subscribe(collection => {
          this._tagify.settings.whitelist = collection;
        });
    }
  }

  writeValue(value: any) {
    if (value) {
      if (this._tagify) {
        this._tagify.loadOriginalValues(value);
        this.value = this.tagifyValue;
      } else {
        this.value = value;
      }
    }
  }

  registerOnChange(fn: (value: any) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: (value: any) => void) { }

  ngOnDestroy() {
    this.notifier.next();
    this.notifier.complete();
    this._tagify.destroy();
  }

}
