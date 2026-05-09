package net.sindibadgroup.ltms.dto.agency;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgencyDTO {

    private Long id;

    @NotBlank(message = "The agency name is required.")
    private String name;

    @NotBlank(message = "The agency address is required.")
    private String address;

    @NotBlank(message = "The company name is required.")
    private String nomDeEntreprise;

    @NotBlank(message = "The email address is required.")
    @Pattern(regexp = "[a-zA-Z0-9]+(?:\\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\\.[a-zA-Z0-9]+)*$", message = "Invalid email address. Please enter a valid email.")
    private String email;

    @NotBlank(message = "The phone number is required.")
    @Size(min = 8, max = 8, message = "The phone number must be exactly 8 digits.")
    private String numeroDeTelephone;

    @NotBlank(message = "The agency registration number (Matricule) is required.")
    private String matricule;

    @NotBlank(message = "The working hours are required.")
    private String horaireDeTravail;

    @NotBlank(message = "The website URL is required.")
    private String siteInternet;

    private boolean isActive;

    private int numberOfVehicles;

    private int numberOfDrivers;
}
