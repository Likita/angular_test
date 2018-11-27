import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DocumentListComponent }      from './document-list/document-list.component';
import { EditDocumentComponent }  from './edit-document/edit-document.component';

const routes: Routes = [
  { path: '', redirectTo: '/documents', pathMatch: 'full' },
  { path: 'document/:id', component: EditDocumentComponent },
  { path: 'documents', component: DocumentListComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
