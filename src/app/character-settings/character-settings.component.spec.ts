import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterSettingsComponent } from './character-settings.component';

describe('CharacterSettingsComponent', () => {
  let component: CharacterSettingsComponent;
  let fixture: ComponentFixture<CharacterSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CharacterSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
