import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Document } from '../document';
import { User } from '../user';
import { DocumentListService } from '../document-list.service';

@Component({
  selector: 'app-edit-document',
  templateUrl: './edit-document.component.html',
  styleUrls: ['./edit-document.component.css']
})

export class EditDocumentComponent implements OnInit, OnDestroy {
  document: Document;
  oldDocument: Document;
  editDocument: any = {};
  userList: User[];
  id = Number(this.route.snapshot.paramMap.get('id'));
  checked: string;

  private editMode = {
    description: false,
    owner: false,
  };

  constructor(
    private documentListService: DocumentListService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() {
    this.documentListService.document.subscribe(document => {
      this.oldDocument = document;
    });

    setTimeout(() => {
      this.documentListService.setId(this.id);
    });

    if (this.oldDocument.id !== this.id) {
      this.getDocument();
    } else {
      this.document = this.oldDocument;
    }

    this.documentListService.userList.subscribe(userList => {
      this.userList = userList;
    });
  }

  ngOnDestroy() {
    this.documentListService.setId(0);
  }

  getDocument(): void {
    this.documentListService.getDocument(this.id)
    .subscribe(document => {
      this.document = document;
      this.checked = document.locked ? 'checked' : null;
    });
  }

  toggle(mode: string): void {
    this.editMode[mode] = !this.editMode[mode];
  }

  changeLocked(): void {
    this.document.locked = !this.document.locked;
    this.editDocument.locked = this.document.locked;
  }

  goBack(): void {
    this.location.back();
  }

  saveOwner(owner: number): void {
    this.editDocument.owner = Number(owner);
    this.document.owner = Number(owner);
    this.editMode.owner = !this.editMode.owner;
  }

  saveDescription(description: string): void {
    if (description) {
      this.editDocument.description = description;
      this.document.description = description;
      this.editMode.description = !this.editMode.description;
    }
  }

  dateFormat(date: string) {
    return this.documentListService.dateFormat(Number(date));
  }

  save(): void {
    this.documentListService.updateDocument(this.id, this.document.title, this.editDocument)
      .subscribe((document) => {
        if (document) {
          this.documentListService.getDocumentList();
          this.documentListService.clearOldDoc();
          this.goBack()
        }
      });
  }
}
