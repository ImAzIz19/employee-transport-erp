package net.sindibadgroup.ltms.model.circuit;

import net.sindibadgroup.ltms.model.agency.Agency;
import net.sindibadgroup.ltms.model.station.Station;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "circuit")
public class Circuit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "path_reference", unique = true)
    private String pathReference;//show this

    @Column(name = "leoni_sap_reference")
    private String leoniSapReference;//show this

    @Column(name = "number_of_kilometres")
    private int numberOfKilometres;//show this

    @Column(name = "employee_contribution")
    private int employeeContribution;//show this

    @Column(name = "kilometre_cost")
    private int kilometreCost;//show this

    @Column(name = "arrival_point")
    private String arrivalPoint;//show this

    @OneToOne
    @JoinColumn(name = "agency_id")
    private Agency agency;//show this .name

    @Column(name = "is_active")
    private boolean isActive = true;

    @OneToMany(mappedBy = "circuit")
    @JsonIgnore
    private Set<Station> stations = new HashSet<>();
}