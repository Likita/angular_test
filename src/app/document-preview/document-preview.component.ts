import { Component, Input, OnInit } from '@angular/core';
import { Document } from '../document';
import { User } from '../user';
import { DocumentListService } from '../document-list.service';

@Component({
  selector: 'app-document-preview',
  templateUrl: './document-preview.component.html',
  styleUrls: ['./document-preview.component.css']
})
export class DocumentPreviewComponent implements OnInit {
  @Input() document: Document;
  userList: User[];

  constructor(private documentListService: DocumentListService) {}
  ngOnInit() {
    this.documentListService.userList.subscribe(userList => {
      this.userList = userList;
    });
  }

  dateFormat(date: string) {
    return this.documentListService.dateFormat(+date);
  }
}
