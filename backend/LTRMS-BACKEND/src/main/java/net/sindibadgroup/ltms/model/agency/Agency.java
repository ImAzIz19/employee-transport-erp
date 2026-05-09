package net.sindibadgroup.ltms.model.agency;

import net.sindibadgroup.ltms.model.driver.Driver;
import net.sindibadgroup.ltms.model.vehicle.Vehicule;
import jakarta.persistence.*;
import lombok.*;
import jakarta.validation.constraints.*;

import java.util.List;

@Entity
@Table(name = "agence")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Agency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false)
    @NotBlank(message = "The agency name is required.")
    private String name;

    @NotBlank(message = "The agency address is required.")
    @Column(nullable = false)
    private String address;

    @NotBlank(message = "The company name is required.")
    @Column(name = "nom_de_entreprise", nullable = false,unique = true)
    private String nomDeEntreprise;

    @NotBlank(message = "The email address is required.")
    @Pattern(regexp = "[a-zA-Z0-9]+(?:\\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\\.[a-zA-Z0-9]+)*$", message = "Invalid email address. Please enter a valid email.")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "The phone number is required.")
    @Size(min = 8, max = 8, message = "The phone number must be exactly 8 digits.")
    @Column(name = "numero_de_telephone", nullable = false, unique = true)
    private String numeroDeTelephone;

    @NotBlank(message = "The agency registration number (Matricule) is required.")
    @Column(nullable = false, unique = true)
    private String matricule;

    @NotBlank(message = "The working hours are required.")
    @Column(name = "horaire_de_travail", nullable = false)
    private String horaireDeTravail;

    @NotBlank(message = "The website URL is required.")
    @Column(name = "site_internet")
    private String siteInternet;

//    @Lob
//    @Column(name = "logo")
//    private byte[] logo;

    private boolean isActive = true ;

    @OneToMany(mappedBy = "agency", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Vehicule> vehicules;

    @OneToMany(mappedBy = "agency", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Driver> drivers;



}