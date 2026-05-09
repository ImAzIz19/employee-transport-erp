package net.sindibadgroup.ltms.dto.vehicle;

import net.sindibadgroup.ltms.dto.agency.AgencyDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehiculeDTO {

    private Long id;

    @NotBlank(message = "The vehicle type is required.")
    private String typeDeVehicule;

    @NotBlank(message = "The vehicle serial number is required.")
    private String numDeSeries;

    @NotBlank(message = "The vehicle commissioning date is required.")
    private String dateDeMiseEnRoute;

    @NotBlank(message = "The vehicle reference number is required.")
    private String numDeReference;

    @NotBlank(message = "The vehicle capacity is required.")
    private String capacite;

    private boolean isActive;

    @NotNull(message = "The agency ID is required.")
    private Long agenceId;

    private AgencyDTO agence;
}