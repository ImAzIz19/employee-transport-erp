package net.sindibadgroup.ltms.model.segment;

import net.sindibadgroup.ltms.model.plant_section.PlantSection;
import net.sindibadgroup.ltms.model.user.UserEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "segment")
public class Segment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;//this

    private String costCenter;//this

    @Column(unique = true)
    private String sapRef;//this

    @ManyToOne
    @JoinColumn(name = "plant_section_id")
    private PlantSection plantSection;//this.name

    @OneToOne
    @JoinColumn(name = "rh_segment_id")
    private UserEntity rhSegment;//this.firstname + lastname head line (rh segement)

    @OneToOne
    @JoinColumn(name = "chef_segment_id")
    private UserEntity chefSegment;//this.firstname + lastname ( chef_segement)

    private boolean isActive = true;
}