import { Injectable } from '@angular/core';
import { Member } from '../interfaces/member';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  membersList: Array<Member> = [];

  constructor() {}

  getMembers() {
    return this.membersList;
  }

  getMember(index: number) {
    return this.membersList[index];
  }

  removeMember(index: number): void {
    this.membersList.splice(index, 1);
  }

  newMember(member: Member): void {
    this.membersList.push(member);
  }

  editMember(member: Member) {
    console.log(member);
    return member;
  }

  setMemberID() {

    let memberID;
    const idList = this.membersList.map(el => el.memberID)

    for (let i=0; i<9999; i++) {
      let num: number = Math.floor(Math.random()*(9999-1+1))+1;
      if(idList.includes(num) == true) {
        i=i+1
        memberID = i.toString();
      } else {
        memberID = num.toString();
      }
    }

    memberID = memberID?.padStart(6, '0');
    return memberID;
  }
}
