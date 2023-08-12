import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppEmailDirective } from './validators/app-email.directive';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations: [LoaderComponent, AppEmailDirective],
  imports: [CommonModule],
  exports: [LoaderComponent, AppEmailDirective],
})
export class SharedModule {}
