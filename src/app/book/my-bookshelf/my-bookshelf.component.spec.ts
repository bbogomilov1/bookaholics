import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBookshelfComponent } from './my-bookshelf.component';

describe('MyBookshelfComponent', () => {
  let component: MyBookshelfComponent;
  let fixture: ComponentFixture<MyBookshelfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyBookshelfComponent]
    });
    fixture = TestBed.createComponent(MyBookshelfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
