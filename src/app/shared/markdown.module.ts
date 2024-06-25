import { NgModule } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule,
    MarkdownModule.forRoot()
  ],
  exports: [
    MarkdownModule
  ]
})
export class SharedMarkdownModule {}
