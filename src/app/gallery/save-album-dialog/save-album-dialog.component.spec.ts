import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveAlbumDialogComponent } from './save-album-dialog.component';

describe('SaveAlbumDialogComponent', () => {
  let component: SaveAlbumDialogComponent;
  let fixture: ComponentFixture<SaveAlbumDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveAlbumDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveAlbumDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
