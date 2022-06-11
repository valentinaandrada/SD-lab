import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Member } from 'src/app/interfaces/member';
import { MemberService } from 'src/app/services/member.service';
import { FormComponent } from '../form/form.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit  {
  membersList: Member[] = [];

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'memberID',
    'name',
    'surname',
    'dni',
    'phone',
    'gender',
    'action',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _memberService: MemberService,
    public _dialog: MatDialog,
    public _snackBar: MatSnackBar,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.membersList = this._memberService.getMembers();
    this.dataSource = new MatTableDataSource(this.membersList);
    this.changeDetectorRef.detectChanges();
    this.dataSource.paginator! = this.paginator;
    this.dataSource.sort! = this.sort;
  }

  removeMember(index: number) {
    this._memberService.removeMember(index);
    this.loadMembers();

    this._snackBar.open('The member was successfully deleted', '', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  editMember(member: Member) {
    this._dialog
      .open(FormComponent, { width: '30rem', data: member })
      .afterClosed()
      .subscribe((res) => {
        this.loadMembers();
      });
  }

  openDialog() {
    this._dialog
      .open(FormComponent, { width: '30rem', disableClose: true })
      .afterClosed()
      .subscribe((res) => {
        this.loadMembers();
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
