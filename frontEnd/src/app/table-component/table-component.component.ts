import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TableServiceService } from '../service/table-service.service';

interface ParentTableData {
  key: number
  club_name: string;
  club_address: string;
  expand: boolean;
}

interface ChildrenTableData {
  key?: number;
  id?: number;
  name: string;
  age: number;
  club_name?: string;
}

@Component({
  selector: 'app-table-component',
  templateUrl: './table-component.component.html',
  styleUrls: ['./table-component.component.scss'],
  providers: [TableServiceService]
})
export class TableComponentComponent implements OnInit, OnDestroy {
  private subscribtion1: Subscription
  private subscribtion2: Subscription

  public tableParentData: ParentTableData[] = [];
  public childrenTableData: ChildrenTableData[] = [];
  public editId: string | null = null;

  public parentColumList = [
    {
      title: '',
      compare: null,
      priority: false
    },
    {
      title: 'Club Name',
      compare: (a: ParentTableData, b: ParentTableData) => a.club_name < b.club_name,
      priority: 1
    },
    {
      title: 'Math Addrss',
      compare: (a: ParentTableData, b: ParentTableData) => a.club_address < b.club_address,
      priority: 2
    },
    {
      title: 'Action',
      compare: null,
      priority: false
    }
  ];

  public childColumnList = [
    {
      title: 'Name',
      compare: (a: ChildrenTableData, b: ChildrenTableData) => a.name < b.name,
      priority: 1
    },
    {
      title: 'Age',
      compare: (a: ChildrenTableData, b: ChildrenTableData) => a.age - b.age,
      priority: 2
    },
    {
      title: 'Action',
      compare: null,
      priority: false
    }
  ];

  constructor(private tableService: TableServiceService) { }

  ngOnInit(): void {

    this.LoadTableData();
  }


  LoadTableData(): void {
    this.subscribtion1 = this.tableService.getTableData().subscribe(res => {
      if (res)
        this.formatData(res);
    }, error => console.log(error))
  }

  startEdit(id: string): void {
    this.editId = id;
  }

  stopEdit(): void {
    this.editId = null;
  }

  deleteParentRow(id: number): void {
    this.tableParentData = this.tableParentData.filter(ele => ele.key !== id);
    this.childrenTableData = this.childrenTableData.filter(ele => ele.key !== id);
  }

  deleteChildRow(id: number): void {
    this.childrenTableData = this.childrenTableData.filter(ele => ele.id !== id);
  }

  submitData(): void {
    let payload = {
      clubs: []
    }

    for (let [index, parent] of this.tableParentData.entries()) {
      payload.clubs.push({
        club_members: this.formatChildMembers(index),
        club_name: parent.club_name,
        club_address: parent.club_address
      })
    }

    this.subscribtion2 = this.tableService.postTableData(payload).subscribe(res => {
      if (res) {
        alert("Data is successfully updated");
        
        this.LoadTableData();
      }
    })
  }


  formatChildMembers(index: number) {
    let data = this.childrenTableData.filter(ele => ele.key === index);
    return data.map(ele => {
      return {
        name: ele.name,
        age: ele.age
      }
    })
  }

  formatData(data: any): void {
    for (let [indx, ele] of data?.clubs.entries()) {
      this.tableParentData.push({
        key: indx,
        club_name: ele.club_name,
        club_address: ele.club_address,
        expand: false

      });

      let map = ele.club_members.map((member: any, i: number) => {
        return {
          key: indx,
          id: indx + "" + i,
          name: member.name,
          age: member.age,
          club_name: ele.club_name
        }
      })
      this.childrenTableData.push(...map);
    }
  }

  ngOnDestroy(): void {
    this.subscribtion1.unsubscribe();
    this.subscribtion2.unsubscribe();
  }

}
