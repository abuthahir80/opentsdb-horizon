/**
 * This file is part of OpenTSDB.
 * Copyright (C) 2021  Yahoo.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Component, OnInit, Inject, HostBinding } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-aura-dialog',
  templateUrl: './aura-dialog.component.html'
})
export class AuraDialogComponent implements OnInit {
  @HostBinding('class.aura-dialog-component') private _hostclass = true;

  urlSafe: SafeResourceUrl;
  constructor(
    private domSanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<AuraDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
  }

  ngOnInit() {
    this.urlSafe = this.domSanitizer.bypassSecurityTrustResourceUrl(this.dialogData.src);
  }

}
