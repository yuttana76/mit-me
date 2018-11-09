import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AuthorityFormService {
    // Label
    from_title = 'Authority information';
    addNewBtn = 'Add new ';
    editAction = 'Edit';

    // Label
    appLabel = 'Application';
    groupLabel = 'Group Name';
    canCreateLabel = 'Can Create';
    canEditLabel = 'Can Edit';
    canViewLabel = 'Can View';
    canDelLabel = 'Can Delete';
    statusLabel = 'Status';
    expDateLabel = 'Expire Date';
}
