import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MytradesComponent } from './mytrades.component';

describe('MytradesComponent', () => {
  let component: MytradesComponent;
  let fixture: ComponentFixture<MytradesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MytradesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MytradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
