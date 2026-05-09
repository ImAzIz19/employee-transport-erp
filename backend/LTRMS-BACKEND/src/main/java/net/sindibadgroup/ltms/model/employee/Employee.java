package net.sindibadgroup.ltms.model.employee;

import net.sindibadgroup.ltms.model.plant_section.PlantSection;
import net.sindibadgroup.ltms.model.segment.Segment;
import net.sindibadgroup.ltms.model.station.Station;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "emplyee")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true)
    private long serialNumber ;//this

    private String firstName;//this

    private String lastName;//this

    private String againstMaster ;//this

    private String groupName ;//this

    private boolean direct ;//this "nature headline"

    @ManyToOne
    @JoinColumn(name = "plant_section_id")
    private PlantSection  plantSection ;//this.name

    private int phoneNumber ;//this

    private int costCenter ;//this

    @ManyToOne
    @JoinColumn(name = "station_id")
    private Station station ;//this.refRegion

    @ManyToOne
    @JoinColumn(name = "segment_id")
    private Segment segment ;//this.name

    private boolean isActive = true ;

    private boolean isActiveForPlanification ;

    private boolean exonerated;

    @OneToMany(mappedBy = "employee", fetch = FetchType.LAZY)
    private List<EmployeePlans> employeePlans;


}
