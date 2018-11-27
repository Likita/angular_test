import { Component, OnInit } from '@angular/core';
import { Document } from '../document';
import { DocumentListService } from '../document-list.service';
import { Observable, Subject } from 'rxjs';
import { PagerService } from '../pager.service';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})

export class DocumentListComponent implements OnInit {
  documentList: Document[];
  filteredList: Document[];

  filterLocked: boolean;
  total: number;
  pager: any = {};
  currentPage: number = 1;
  pagedItems: any[];
  searchedTitle: string;
  private filterTitleSubject = new Subject<string>();
  private searchTimer: number = 0;
  constructor(
    private documentListService: DocumentListService,
    private pagerService: PagerService) {}

  ngOnInit() {
    this.getDocumentList();
  }

  getDocumentList(): void {
    this.documentListService.documentList.subscribe(documentList => {
      this.documentList = documentList.items || [];
      this.total = this.documentList.length;
      this.setPage(this.currentPage)
    });
  }

  searchTitle(title: string): void {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    this.searchTimer = setTimeout(() => {
      if (title.trim()) {
        this.filterTitleSubject.next(title);
        this.searchedTitle = title;
        this.documentListService.searchTitleDocumentList(title)
        .subscribe(documentList => {
          this.filteredList = documentList.items || [];
          this.total = this.filteredList.length;
          this.setPage(this.currentPage)
        });
      } else {
        this.filteredList = undefined;
        this.total = this.documentList.length;
        this.setPage(this.currentPage)
      }
    }, 1000);
  }

  searchLocked(): void {
    this.filterLocked = !this.filterLocked;
    if (this.filterLocked) {
      this.documentListService.searchLockedDocumentList(this.filterLocked)
      .subscribe(documentList => {
        this.filteredList = documentList.items || [];
        this.total = this.filteredList.length;
        this.setPage(this.currentPage)
      });
    } else {
      this.filteredList = undefined;
      this.total = this.documentList.length;
      this.setPage(this.currentPage)
    }
  }

  setPage(page: number) {
    const data = this.filteredList ? this.filteredList : this.documentList;
    this.pager = this.pagerService.getPager(data.length, page);
    this.pagedItems = data.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
}
