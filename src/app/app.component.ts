import { Component, OnInit } from '@angular/core';
import { DocumentListService } from './document-list.service';
import { Document } from './document';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  document: Document;
  rootPath: boolean = true;

  constructor(private documentListService: DocumentListService) {
  }

  ngOnInit() {
    this.documentListService.getUserList();
    this.documentListService.getDocumentList();

    this.documentListService.document.subscribe(document => {
      this.document = document;
    });

    this.documentListService.id.subscribe(id => {
      this.rootPath = !id;
    });
  }
}
