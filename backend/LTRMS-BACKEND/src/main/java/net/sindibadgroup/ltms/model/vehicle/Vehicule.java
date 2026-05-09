package net.sindibadgroup.ltms.model.vehicle;

import net.sindibadgroup.ltms.model.agency.Agency;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "vehicule")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "The vehicle type is required.")
    @Column(name = "type_de_vehicule", nullable = false)
    private String typeDeVehicule;//show this

    @NotBlank(message = "The vehicle serial number is required.")
    @Column(name = "num_de_series", nullable = false, unique = true)
    private String numDeSeries;//show this

    @NotBlank(message = "The vehicle commissioning date is required.")
    @Column(name = "date_de_mise_en_route", nullable = false)
    private String dateDeMiseEnRoute;//show this

    @NotBlank(message = "The vehicle reference number is required.")
    @Column(name = "num_de_reference", nullable = false, unique = true)
    private String numDeReference;//show this

    @NotBlank(message = "The vehicle capacity is required.")
    @Column(nullable = false)
    private String capacite;//show this

    private boolean isActive = true ;

    @NotNull(message = "The agency association is required.")
    @ManyToOne
    @JoinColumn(name = "agency_id", nullable = false)
    private Agency agency;//show  the agency.name
}
