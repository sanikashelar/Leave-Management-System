import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import submitLeaveRequest from '@salesforce/apex/LeaveRequestController.submitLeaveRequest';
import getLeaveRequests from '@salesforce/apex/LeaveRequestController.getLeaveRequests';
import updateLeaveRequestStatus from '@salesforce/apex/LeaveRequestController.updateLeaveRequestStatus';

const ACTIONS = [
    { label: 'Approve', name: 'approve' },
    { label: 'Reject', name: 'reject' }
];

const COLUMNS = [
    { 
        label: 'Request ID', 
        fieldName: 'recordUrl', 
        type: 'url', 
        typeAttributes: { 
            label: { fieldName: 'Name' }, 
            target: '_blank' 
        } 
    },
    { label: 'Employee', fieldName: 'EmployeeName' },
    { label: 'Type', fieldName: 'Leave_Type__c' },
    { label: 'Start Date', fieldName: 'Start_Date__c', type: 'date' },
    { label: 'End Date', fieldName: 'End_Date__c', type: 'date' },
    { label: 'Duration', fieldName: 'Duration__c', type: 'number' },
    { label: 'Status', fieldName: 'Status__c' },
    { type: 'action', typeAttributes: { rowActions: ACTIONS } }
];

export default class LeaveManagement extends LightningElement {
    @track employeeName = '';
    @track employeeEmail = '';
    @track leaveType = '';
    @track startDate = '';
    @track endDate = '';
    @track duration = 0;
    @track reason = '';
    @track statusFilter = 'All';
    @track leaveRequests = [];
    
    columns = COLUMNS;
    wiredLeaveResult;

    leaveTypeOptions = [
        { label: 'Casual Leave', value: 'Casual' },
        { label: 'Sick Leave', value: 'Sick' },
        { label: 'Earned Leave', value: 'Earned' }
    ];

    statusOptions = [
        { label: 'All', value: 'All' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Approved', value: 'Approved' },
        { label: 'Rejected', value: 'Rejected' }
    ];

    handleInputChange(event) {
        const field = event.target.dataset.id;
        if (field === 'Employee_Name') this.employeeName = event.target.value;
        if (field === 'Employee_Email') this.employeeEmail = event.target.value;
        if (field === 'Leave_Type__c') this.leaveType = event.target.value;
        if (field === 'Start_Date__c') this.startDate = event.target.value;
        if (field === 'End_Date__c') this.endDate = event.target.value;
        if (field === 'Reason__c') this.reason = event.target.value;

        if (this.startDate && this.endDate) {
            let start = new Date(this.startDate);
            let end = new Date(this.endDate);
            let diffTime = end - start;
            let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            this.duration = diffDays > 0 ? diffDays : 0;
        }
    }

    @wire(getLeaveRequests, { statusFilter: '$statusFilter' })
    wiredRequests(result) {
        this.wiredLeaveResult = result;
        if (result.data) {
            this.leaveRequests = result.data.map(row => ({
                ...row,
                EmployeeName: row.Employee__r ? row.Employee__r.Name : '',
                recordUrl: `/lightning/r/Leave_Request__c/${row.Id}/view`
            }));
        } else if (result.error) {
            this.leaveRequests = [];
        }
    }

    handleSubmit() {
        submitLeaveRequest({
            employeeName: this.employeeName,
            employeeEmail: this.employeeEmail,
            leaveType: this.leaveType,
            startDate: this.startDate,
            endDate: this.endDate,
            reason: this.reason
        })
        .then(() => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: 'Leave request submitted successfully!',
                variant: 'success'
            }));
            this.employeeName = '';
            this.employeeEmail = '';
            this.leaveType = '';
            this.startDate = '';
            this.endDate = '';
            this.duration = 0;
            this.reason = '';
            return refreshApex(this.wiredLeaveResult);
        })
        .catch(error => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error submitting request',
                message: error.body.message,
                variant: 'error'
            }));
        });
    }

    handleFilterChange(event) {
        this.statusFilter = event.target.value;
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        const newStatus = actionName === 'approve' ? 'Approved' : 'Rejected';

        updateLeaveRequestStatus({ requestId: row.Id, newStatus: newStatus })
            .then(() => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success',
                    message: `Leave request ${newStatus.toLowerCase()} successfully!`,
                    variant: 'success'
                }));
                return refreshApex(this.wiredLeaveResult);
            })
            .catch(error => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error',
                    message: error.body.message,
                    variant: 'error'
                }));
            });
    }
}
