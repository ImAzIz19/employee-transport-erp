package net.sindibadgroup.ltms.dto.circuit;

import lombok.Data;

import java.util.Set;

@Data
public class CircuitDTO {
    private Integer id;
    private String pathReference;
    private String leoniSapReference;
    private int numberOfKilometres;
    private int employeeContribution;
    private int kilometreCost;
    private String arrivalPoint;
    private Integer agencyId;
    private boolean isActive;
    private Set<Integer> stations;
}