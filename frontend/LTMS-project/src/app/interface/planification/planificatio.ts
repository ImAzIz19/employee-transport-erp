export interface PlanificationDTO {
    id: number;
    week: string;
    userName: string;
    actionName: string;
    targetAction: string;
    targetActionVariant: string;
    orgName: string;
    plantSectionName: string;
    segmentName: string;
    totalLines: number;
    emplyeesNotActifForPlanification: number; // they exist but their isActiveForPlanification is false
    successSaved: number; // number of success employee that have no problem their matricule found and isActiveForPlanification
    nonExistentEmployees: number; // number of success employee that their matricule do not exist in data base
    invalidDays: number; // number of employees that have at least one invalid time, the time should be in that format "hh:mm hh:mm" or "repos"
}