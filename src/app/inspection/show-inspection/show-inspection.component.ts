import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { InspectionApiService } from 'src/app/service/inspection-api.service';

@Component({
  selector: 'app-show-inspection',
  templateUrl: './show-inspection.component.html',
  styleUrls: ['./show-inspection.component.css']
})
export class ShowInspectionComponent implements OnInit {

  inspectionList$!: Observable<any[]>;
  inspectionTypeList$!: Observable<any[]>;
  inspectionTypeList: any = [];

  //Map  to display  data associate with FK
  inspectionTypeMap: Map<number, string> = new Map();

  constructor(private service: InspectionApiService) { }

  ngOnInit(): void {
    this.inspectionList$ = this.service.getInspectionList();
    this.inspectionTypeList$ = this.service.getInspectionTypeList();
    this.refreshInspectionTypesMap();
  }
  // variable 
  modalTitle: string = '';
  activateAddEditInspectionComponent: boolean = false;
  inspection: any;

  modalClose() {
    this.activateAddEditInspectionComponent = false;
    this, this.inspectionList$ = this.service.getInspectionList();
  }

  modalAdd() {
    this.inspection = {
      id: 0,
      status: null,
      comments: null,
      inspectionTypeId: null
    }
    this.modalTitle = 'Add Inspection';
    this.activateAddEditInspectionComponent = true;
  }

  modalEdit(item: any) {
    this.inspection = item;
    this.modalTitle = 'Edit inspection';
    this.activateAddEditInspectionComponent = true;
  }
  delete(item: any) {
    if (confirm('are you want to delete inspection ${item.id}')) {
      this.service.deleteInspection(item.id).subscribe(res => {
        var closeModel = document.getElementById('add-edit-modal-close');
        if (closeModel) {
          closeModel.click();
        }
        var showDeleteSuccess = document.getElementById('delete-success-alert');
        if (showDeleteSuccess) {
          showDeleteSuccess.style.display = 'block';
        }
        setTimeout(() => {
          if (showDeleteSuccess) {
            showDeleteSuccess.style.display = 'none';
          }
        }, 4000);
        this.inspectionList$ = this.service.getInspectionList();
      })
    }
  }

  refreshInspectionTypesMap() {
    this.service.getInspectionTypeList().subscribe(data => {
      this.inspectionTypeList = data;
      for (let i = 0; i < data.length; i++) {
        this.inspectionTypeMap.set(this.inspectionTypeList[i].id, this.inspectionTypeList[i].inspectionName);
      }
    })
  }

}
