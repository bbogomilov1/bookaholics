import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppEmailDirective } from './validators/app-email.directive';
import { SlicePipe } from './pipes/slice.pipe';
import { ElapsedTimePipe } from './pipes/elapsed-time.pipe';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations: [
    LoaderComponent,
    AppEmailDirective,
    SlicePipe,
    ElapsedTimePipe,
  ],
  imports: [CommonModule],
  exports: [LoaderComponent, AppEmailDirective, ElapsedTimePipe],
})
export class SharedModule {}
