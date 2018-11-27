import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { DocumentListComponent } from './document-list/document-list.component';
import { EditDocumentComponent } from './edit-document/edit-document.component';
import { AppRoutingModule } from './/app-routing.module';
import { FormsModule } from '@angular/forms';
import { MessagesComponent } from './messages/messages.component';
import { DocumentPreviewComponent } from './document-preview/document-preview.component'

@NgModule({
  declarations: [
    AppComponent,
    DocumentListComponent,
    EditDocumentComponent,
    MessagesComponent,
    DocumentPreviewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
