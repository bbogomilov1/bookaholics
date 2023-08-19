import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppEmailDirective } from './validators/app-email.directive';
import { LoaderComponent } from './loader/loader.component';
import { ErrorMessageComponent } from './error-message/error-message.component';

@NgModule({
  declarations: [LoaderComponent, AppEmailDirective, ErrorMessageComponent],
  imports: [CommonModule],
  exports: [LoaderComponent, AppEmailDirective, ErrorMessageComponent],
})
export class SharedModule {}
