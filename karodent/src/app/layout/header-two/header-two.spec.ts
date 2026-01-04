import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderTwo } from './header-two';

describe('HeaderTwo', () => {
  let component: HeaderTwo;
  let fixture: ComponentFixture<HeaderTwo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderTwo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderTwo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
