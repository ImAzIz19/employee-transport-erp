package net.sindibadgroup.ltms.model.planification;

import net.sindibadgroup.ltms.model.agency.Agency;
import net.sindibadgroup.ltms.model.circuit.Circuit;
import net.sindibadgroup.ltms.model.plant_section.PlantSection;
import net.sindibadgroup.ltms.model.shift.Shift;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "bus_plan")
public class BusPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String week;

    private String weekday;

    @ManyToOne
    private PlantSection plantSection;

    @ManyToOne
    private Agency agency;

    @ManyToOne
    private Circuit circuit;

    @ManyToOne
    private Shift shift;

    private int employeeNumber;

    private int numberOfStandardBuses;

    private int numberOfMiniBuses;



}