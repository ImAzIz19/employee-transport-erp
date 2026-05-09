package net.sindibadgroup.ltms.dto.action;


import java.util.Date;

public record UploadActionDTO (
     Integer id,
     Date creationDate,
     String userName,
     String actionName,
     String targetAction,
     String orgName,
     String status
){}
