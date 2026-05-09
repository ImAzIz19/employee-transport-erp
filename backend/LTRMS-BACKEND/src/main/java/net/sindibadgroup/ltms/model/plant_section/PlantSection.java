package net.sindibadgroup.ltms.model.plant_section;

import net.sindibadgroup.ltms.model.segment.Segment;
import net.sindibadgroup.ltms.model.user.UserEntity;
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
@Table(name = "Plant Section")
public class PlantSection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;//this

    private String description;//this

    private String emplacement;//this

    @OneToOne
    @JoinColumn(name = "ps_manager_id")
    private UserEntity psManager;// First Name + LastName (ps manager as header)

    @OneToOne
    @JoinColumn(name = "rh_manager_id")
    private UserEntity rhManager;// First Name + LastName (rh manager as header)

    private String organization;//this

    private boolean isActive = true;

    @OneToMany(mappedBy = "plantSection")
    private List<Segment> segments;//their names
}