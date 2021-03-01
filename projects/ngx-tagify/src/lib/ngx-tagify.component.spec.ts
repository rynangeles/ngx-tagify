import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxTagifyComponent } from './ngx-tagify.component';

describe('NgxTagifyComponent', () => {
  let component: NgxTagifyComponent;
  let fixture: ComponentFixture<NgxTagifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxTagifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxTagifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
