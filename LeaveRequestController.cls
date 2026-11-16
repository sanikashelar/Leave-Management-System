public with sharing class LeaveRequestController {

    @AuraEnabled
    public static void submitLeaveRequest(String employeeName, String employeeEmail, String leaveType, Date startDate, Date endDate, String reason) {
        if (startDate > endDate) {
            throw new AuraHandledException('Start Date cannot be later than End Date.');
        }

        Integer duration = startDate.daysBetween(endDate) + 1;

        Leave_Request__c req = new Leave_Request__c();
        req.Employee__c = UserInfo.getUserId();
        req.Leave_Type__c = leaveType;
        req.Start_Date__c = startDate;
        req.End_Date__c = endDate;
        req.Duration__c = duration;
        req.Reason__c = reason;
        req.Status__c = 'Pending';

        insert req;
    }

    @AuraEnabled(cacheable=true)
    public static List<Leave_Request__c> getLeaveRequests(String statusFilter) {
        String query = 'SELECT Id, Name, Leave_Type__c, Start_Date__c, End_Date__c, Duration__c, Reason__c, Status__c, Employee__r.Name FROM Leave_Request__c';
        if (String.isNotBlank(statusFilter) && statusFilter != 'All') {
            query += ' WHERE Status__c = :statusFilter';
        }
        query += ' ORDER BY CreatedDate DESC';
        return Database.query(query);
    }

    @AuraEnabled
    public static void updateLeaveRequestStatus(Id requestId, String newStatus) {
        Leave_Request__c req = new Leave_Request__c(Id = requestId, Status__c = newStatus);
        update req;
    }
}
