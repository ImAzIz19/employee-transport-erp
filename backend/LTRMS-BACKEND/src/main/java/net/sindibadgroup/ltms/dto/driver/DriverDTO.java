package net.sindibadgroup.ltms.dto.driver;

import net.sindibadgroup.ltms.dto.agency.AgencyDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DriverDTO {

    private Long id;

    @NotBlank(message = "The first name is required.")
    private String prenom;

    @NotBlank(message = "The last name is required.")
    private String nom;

    @NotBlank(message = "The date of birth is required.")
    private String dateDeNaissance;

    @NotBlank(message = "The phone number is required.")
    @Size(min = 8, max = 8, message = "The phone number must be exactly 8 digits.")
    private String telephone;

    private boolean isActive;

    @NotNull(message = "The agency ID is required.")
    private Long agenceId;

	private AgencyDTO agence;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getPrenom() {
		return prenom;
	}

	public void setPrenom(String prenom) {
		this.prenom = prenom;
	}

	public String getNom() {
		return nom;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}

	public String getDateDeNaissance() {
		return dateDeNaissance;
	}

	public void setDateDeNaissance(String dateDeNaissance) {
		this.dateDeNaissance = dateDeNaissance;
	}

	public String getTelephone() {
		return telephone;
	}

	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}

	public boolean isActive() {
		return isActive;
	}

	public void setActive(boolean active) {
		isActive = active;
	}

	public Long getAgenceId() {
		return agenceId;
	}

	public void setAgenceId(Long agenceId) {
		this.agenceId = agenceId;
	}

	public AgencyDTO getAgence() {
		return agence;
	}

	public void setAgence(AgencyDTO agence) {
		this.agence = agence;
	}
}
