package net.sindibadgroup.ltms.model.driver;

import net.sindibadgroup.ltms.model.agency.Agency;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "chauffeur")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "The first name is required.")
    @Column(name = "prenom", nullable = false)
    private String prenom;

    @NotBlank(message = "The last name is required.")
    @Column(name = "nom", nullable = false)
    private String nom;

    @NotBlank(message = "The date of birth is required.")
    @Column(name = "date_de_naissance", nullable = false)
    private String dateDeNaissance;

    @NotBlank(message = "The phone number is required.")
    @Size(min = 8, max = 8, message = "The phone number must be exactly 8 digits.")
    @Column(name = "telephone", nullable = false, unique = true)
    private String telephone;

    private boolean isActive = true ;

    @NotNull(message = "The agency association is required.")
    @ManyToOne
    @JoinColumn(name = "agency_id", nullable = false)
    private Agency agency;
}
