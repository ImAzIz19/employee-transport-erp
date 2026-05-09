package net.sindibadgroup.ltms.model.station;

import net.sindibadgroup.ltms.model.circuit.Circuit;
import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "station")
public class Station {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column
    private String name ;//this

    @Column(name = "ref_region" , unique = true)
    private String refRegion;//this

    @Column(name = "ref_sap_leoni", unique = true)
    private Double refSapLeoni;//this

    @Column
    private double longitude;//this

    @Column
    private double latitude;//this

    @Column
    private double radius;//this

    @Column(name = "is_active")
    private boolean isActive = true;

    @ManyToOne
    @JoinColumn(name = "circuit_id")
    private Circuit circuit;//this
}