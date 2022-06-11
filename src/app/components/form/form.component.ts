import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Member } from 'src/app/interfaces/member';
import { MemberService } from 'src/app/services/member.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})

export class FormComponent implements OnInit {
  memberForm: FormGroup;
  gender = [
    { id: 1, value: 'Female' },
    { id: 2, value: 'Male' },
  ];
  actionBtn: String = 'Add';

  constructor(
    private fb: FormBuilder,
    private _memberService: MemberService,
    public _dialogRef: MatDialogRef<FormComponent>,
    public _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public editData: any
  ) {
    this.memberForm = this.fb.group({
      memberID: this._memberService.setMemberID(),
      name: ['', [Validators.required, Validators.minLength(3)]],
      surname: ['', [Validators.required, Validators.minLength(3)]],
      dni: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{9}')]],
      gender: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.editData) {
      this.actionBtn = 'Update';
      this.memberForm.controls['memberID'].setValue(this.editData.memberID);
      this.memberForm.controls['name'].setValue(this.editData.name);
      this.memberForm.controls['surname'].setValue(this.editData.surname);
      this.memberForm.controls['dni'].setValue(this.editData.dni);
      this.memberForm.controls['phone'].setValue(this.editData.phone);
      this.memberForm.controls['gender'].setValue(this.editData.gender);
    }
  }

  addMember() {
    if (!this.editData) {
      const member: Member = {
        memberID: this.memberForm.value.memberID,
        name: this.memberForm.value.name,
        surname: this.memberForm.value.surname,
        dni: this.memberForm.value.dni,
        phone: this.memberForm.value.phone,
        gender: this.memberForm.value.gender,
      };
      this._memberService.newMember(member);
      this.closeDialog();
      this._snackBar.open(`The member ID: ${this.memberForm.value.memberID} was successfully added`, '', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    } else {
      this.updateMember();
    }
  }

  updateMember() {
    const index = this._memberService.membersList.indexOf(this.editData);
    const updatedMember = this._memberService.getMember(index);

    updatedMember.memberID = this.memberForm.value.memberID;
    updatedMember.name = this.memberForm.value.name;
    updatedMember.surname = this.memberForm.value.surname;
    updatedMember.dni = this.memberForm.value.dni;
    updatedMember.phone = this.memberForm.value.phone;
    updatedMember.gender = this.memberForm.value.gender;

    this.closeDialog();
    this._snackBar.open(`The member ID: ${this.memberForm.value.memberID} was successfully edited`, '', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  closeDialog() {
    this._dialogRef.close({ event: 'cancel' });
  }
}
