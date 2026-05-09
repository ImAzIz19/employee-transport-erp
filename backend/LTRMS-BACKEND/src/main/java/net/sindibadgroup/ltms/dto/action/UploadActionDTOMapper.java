package net.sindibadgroup.ltms.dto.action;


import net.sindibadgroup.ltms.model.action.UploadAction;

import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class UploadActionDTOMapper implements Function<UploadAction, UploadActionDTO>{

    @Override
    public UploadActionDTO apply(UploadAction uploadAction) {
        return new UploadActionDTO(
                uploadAction.getId(),
                uploadAction.getCreationDate(),
                uploadAction.getUserName(),
                uploadAction.getActionName(),
                uploadAction.getTargetAction(),
                uploadAction.getOrgName(),
                uploadAction.getStatus()
        );
    }
}
