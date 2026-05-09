package com.emerald.ltms.entities;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.emerald.ltms.util.LDateUtils;

@Entity
@NamedQueries({
	@NamedQuery(name = PersistableDailyPlanningRecapModel.ALL, query = "Select u from PersistableDailyPlanningRecapModel u"),
	@NamedQuery(name = PersistableDailyPlanningRecapModel.BY_CALENDAR_WEEK_AND_AGENCY_NAME, query = "Select u from PersistableDailyPlanningRecapModel u where calendarWeek = :kw and (agencyName = :agency or agencyId= :agencyId) and orgId=:orgid "),
	@NamedQuery(name = PersistableDailyPlanningRecapModel.BY_CALENDAR_WEEK_AND_AGENCY_NAME_NAVROUTID, query = "Select u from PersistableDailyPlanningRecapModel u where calendarWeek = :kw and (agencyName = :agency or agencyId= :agencyId ) and orgId=:orgid  and (navRouteId = :navrouteId )"),
	@NamedQuery(name = PersistableDailyPlanningRecapModel.BY_CALENDAR_WEEK_AND_AGENCY_NAME_NAVROUTID_OR_NAVROUTENAME, query = "Select u from PersistableDailyPlanningRecapModel u where calendarWeek = :kw and (agencyName = :agency or agencyId= :agencyId ) and orgId=:orgid  and (navRouteId = :navrouteId or navRoute = :navrouteName)"),
	
	@NamedQuery(name = PersistableDailyPlanningRecapModel.BY_CALENDAR_WEEK, query = "Select u from PersistableDailyPlanningRecapModel u where calendarWeek = :kw  and orgId=:orgid "),
	@NamedQuery(name = PersistableDailyPlanningRecapModel.BY_CALENDAR_WEEK_NO_ORG, query = "Select u from PersistableDailyPlanningRecapModel u where calendarWeek = :kw   "),
	@NamedQuery(name = PersistableDailyPlanningRecapModel.BY_MONTH_YEAR_AND_AGENCY_NAME, query = "Select u from PersistableDailyPlanningRecapModel u where daydate >= :fromDay and daydate<= :today and (agencyName = :agency or agencyId= :agencyId) and orgId=:orgid "),
	@NamedQuery(name = PersistableDailyPlanningRecapModel.BY_MONTH_YEAR_AND_AGENCY_NAME_AND_NAVIGATION_PATH , query = "Select u from PersistableDailyPlanningRecapModel u where daydate >= :fromDay and daydate<= :today and (agencyName = :agency or agencyId= :agencyId) and orgId=:orgid  and (navRouteId = :navrouteId or navRoute = :navrouteName)"),
	@NamedQuery(name = PersistableDailyPlanningRecapModel.BY_CALENDAR_WEEK_AND_AGENCY_NAME_INCLUDE_DAY, query = "Select u from PersistableDailyPlanningRecapModel u where calendarWeek = :kw and (agencyName = :agency or agencyId= :agencyId) and dayOfWeek=:day and orgId=:orgid "),
	@NamedQuery(name = PersistableDailyPlanningRecapModel.DELETE_BY_RECAP, query = "delete from PersistableDailyPlanningRecapModel where calendarWeek = :kw and (agencyName = :agency) and orgId=:orgid"),
	@NamedQuery(name = PersistableDailyPlanningRecapModel.RESET_RECAP_DATA_BY_WEEK, query = "delete from PersistableDailyPlanningRecapModel where calendarWeek = :kw  and orgId=:orgid"),
	@NamedQuery(name = PersistableDailyPlanningRecapModel.DELETE_BY_RECAP_INCLUDE_DAY, query = "delete from PersistableDailyPlanningRecapModel where calendarWeek = :kw and (agencyName = :agency  or agencyId= :agencyId) and dayOfWeek=:day and orgId=:orgid")
	
	
})

@Table(name = "daily_shift_plan_recap")
public class PersistableDailyPlanningRecapModel extends BaseEntity implements Serializable, Comparable<PersistableDailyPlanningRecapModel> {
	
	
	public static final String BY_CALENDAR_WEEK_AND_AGENCY_NAME = "PersistableDailyPlanningRecapModel.BY_CALENDAR_WEEK_AND_AGENCY_NAME";
	public static final String BY_CALENDAR_WEEK_AND_AGENCY_NAME_NAVROUTID = "PersistableDailyPlanningRecapModel.BY_CALENDAR_WEEK_AND_AGENCY_NAME_NAVROUTID";
	public static final String BY_CALENDAR_WEEK_AND_AGENCY_NAME_NAVROUTID_OR_NAVROUTENAME = "PersistableDailyPlanningRecapModel.BY_CALENDAR_WEEK_AND_AGENCY_NAME_NAVROUTID_OR_NAVROUTENAME";
	public static final String BY_CALENDAR_WEEK_AND_AGENCY_NAME_NAVROUTENAME = "PersistableDailyPlanningRecapModel.BY_CALENDAR_WEEK_AND_AGENCY_NAME_NAVROUTENAME";
	
	
	//public static final String BY_CALENDAR_WEEK_AND_AGENCY_NAME_NAVROUTID = "PersistableDailyPlanningRecapModel.BY_CALENDAR_WEEK_AND_AGENCY_NAME_NAVROUTID";
	public static final String BY_CALENDAR_WEEK = "PersistableDailyPlanningRecapModel.BY_CALENDAR_WEEK";
	public static final String BY_CALENDAR_WEEK_AND_AGENCY_NAME_INCLUDE_DAY = "PersistableDailyPlanningRecapModel.BY_CALENDAR_WEEK_AND_AGENCY_NAME_INCLUDE_DAY";
	public static final String BY_CALENDAR_WEEK_INCLUDE_DAY = "PersistableDailyPlanningRecapModel.BY_CALENDAR_WEEK_AND_AGENCY_NAME_INCLUDE_DAY";
	public static final String ALL = "PersistableDailyPlanningRecapModel.ALL";
	public static final String DELETE_BY_RECAP = "PersistableDailyPlanningRecapModel.DELETE_BY_RECAP";
	public static final String DELETE_BY_RECAP_INCLUDE_DAY = "PersistableDailyPlanningRecapModel.DELETE_BY_RECAP_INCLUDE_DAY";
	public static final String RESET_RECAP_DATA_BY_WEEK = "PersistableDailyPlanningRecapModel.RESET_RECAP_DATA_BY_WEEK";
	public static final String BY_MONTH_YEAR_AND_AGENCY_NAME = "PersistableDailyPlanningRecapModel.BY_MONTH_YEAR_AND_AGENCY_NAME";
	
	public static final String BY_MONTH_YEAR_AND_AGENCY_NAME_AND_NAVIGATION_PATH = "PersistableDailyPlanningRecapModel.BY_MONTH_YEAR_AND_AGENCY_NAME_AND_NAVIGATION_PATH";
	public static final String BY_CALENDAR_WEEK_NO_ORG = "PersistableDailyPlanningRecapModel.BY_CALENDAR_WEEK_NO_ORG";
	
	 /**
	 * 
	 */
	private static final long serialVersionUID = 2363553530760837414L;
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

	
	int nbreOfEmployees; 
	
	int numberOfVehicles; 
	@Column(nullable = true)
	int numberOfStandardBuses; 
	@Column(nullable = true)
	int numberOfMiniBuses; 
	
	
	String propNbrOfVehiclesTextual; 
	Long orgId; 
	Long navRouteId; 
	
	
	
	
	
	String propNbrOfVehiclesGenericTextual; 
	
	String userName; 
	Date modifDate; 
	
	String shiftStart;
	String shiftEnd; 
	String agencyName; 
	Long agencyId; 
	String agencyReferenceName; 
	String navRoute; 
	String calendarWeek;
	String dayOfWeek; 
	
	@Column(nullable = true)
	Long daydate; 
	
	int indexOfDayInWeek; 
	
	
	
	boolean sentToAgency; 
	@Transient
	String routePoint;
	
	public Long getId() {
		return id;
	}
	
	
	
	public void setId(Long id) {
		this.id = id;
	}
	
	
	
	
	
	public boolean isSentToAgency() {
		return sentToAgency;
	}
	
	
	public void setSentToAgency(boolean sentToAgency) {
		this.sentToAgency = sentToAgency;
	}
	
	
	public void setAgencyReferenceName(String agencyReferenceName) {
		this.agencyReferenceName = agencyReferenceName;
	}
	
	public String getAgencyReferenceName() {
		return agencyReferenceName;
	}
	
	



	public String getPropNbrOfVehiclesGenericTextual() {
		return propNbrOfVehiclesGenericTextual;
	}



	public void setPropNbrOfVehiclesGenericTextual(
			String propNbrOfVehiclesGenericTextual) {
		this.propNbrOfVehiclesGenericTextual = propNbrOfVehiclesGenericTextual;
	}



	public String getUserName() {
		return userName;
	}


	public void setOrgId(Long orgId) {
		this.orgId = orgId;
	}
	
	
	public Long getOrgId() {
		return orgId;
	}
	
	
	

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public void setRoutePoint(String routePoint) {
		this.routePoint = routePoint;
	}
	
	
	public String getRoutePoint() {
		return routePoint;
	}

	public void setModifDate(Date modifDate) {
		this.modifDate = modifDate;
	}
	
	public Date getModifDate() {
		return modifDate;
	}
	
	


	public String getShiftStart() {
		return shiftStart;
	}



	public void setShiftStart(String shiftStart) {
		this.shiftStart = shiftStart;
	}



	public String getShiftEnd() {
		return shiftEnd;
	}



	public void setShiftEnd(String shiftEnd) {
		this.shiftEnd = shiftEnd;
	}



	public String getAgencyName() {
		return agencyName;
	}



	public void setAgencyName(String agencyName) {
		this.agencyName = agencyName;
	}

	
	public void setAgencyId(Long agencyId) {
		this.agencyId = agencyId;
	}
	
	
	public Long getAgencyId() {
		return agencyId;
	}
	
	
	


	public String getNavRoute() {
		return navRoute;
	}



	public void setNavRoute(String navRoute) {
		this.navRoute = navRoute;
	}

	
	public void setNavRouteId(Long navRouteId) {
		this.navRouteId = navRouteId;
	}
	
	
	public Long getNavRouteId() {
		return navRouteId;
	}


	public void setCalendarWeek(String calendarWeek) {
		this.calendarWeek = calendarWeek;
	}
	
	public String getCalendarWeek() {
		return calendarWeek;
	}
	
	



	@Override
	public String getAllQueryNoWhere() {
		// TODO Auto-generated method stub
		return null;
	}



	public void applyGenericForAll() {
		// TODO Auto-generated method stub
		
		
		
		
		
		 
		 
		
		
		
		propNbrOfVehiclesGenericTextual = ""; 
	}
	
	
	
	
	
	
	public int getNbreOfEmployees() {
		return nbreOfEmployees;
	}



	public void setNbreOfEmployees(int nbreOfEmployees) {
		this.nbreOfEmployees = nbreOfEmployees;
	}



	public int getNumberOfVehicles() {
		return numberOfVehicles;
	}



	public void setNumberOfVehicles(int numberOfVehicles) {
		this.numberOfVehicles = numberOfVehicles;
	}



	public String getPropNbrOfVehiclesTextual() {
		
		return propNbrOfVehiclesTextual;
	}


	public void setNumberOfMiniBuses(int numberOfMiniBuses) {
		this.numberOfMiniBuses = numberOfMiniBuses;
	}
	public int getNumberOfMiniBuses() {
		return numberOfMiniBuses;
	}
	
	
	public void setNumberOfStandardBuses(int numberOfStandardBuses) {
		this.numberOfStandardBuses = numberOfStandardBuses;
	}
	
	
	public int getNumberOfStandardBuses() {
		return numberOfStandardBuses;
	}
	
	
	
	
	
	public void setPropNbrOfVehiclesTextual(String propNbrOfVehiclesTextual) {
		this.propNbrOfVehiclesTextual = propNbrOfVehiclesTextual;
	}



	public String getDayOfWeek() {
		
		
		
		return dayOfWeek;
	}


	
	

	public void setDayOfWeek(String dayOfWeek) {
		this.dayOfWeek = dayOfWeek;
	}

	public void setDaydate(Long daydate) {
		this.daydate = daydate;
	}
	
	
	public Long getDaydate() {
		return daydate;
	}




	public int getIndexOfDayInWeek() {
		return indexOfDayInWeek;
	}



	public void setIndexOfDayInWeek(int indexOfDayInWeek) {
		this.indexOfDayInWeek = indexOfDayInWeek;
	}



	@Override
	public int compareTo(PersistableDailyPlanningRecapModel other) {
		// TODO Auto-generated method stub
		
		int compareAgency =  this.getAgencyName().compareTo(other.getAgencyName()); 
		if(compareAgency==0){
			// 
			int compareNavroute =  this.getNavRoute().compareTo(other.getNavRoute()); 
			
			if(compareNavroute==0){
				Integer thisIndex = new Integer(this.indexOfDayInWeek); 
				Integer otherIndex =  new Integer(other.getIndexOfDayInWeek()); 
				int compareDays = thisIndex.compareTo(otherIndex); 
				if(compareDays==0){
					return this.getShiftStart().compareTo(other.getShiftStart()); 
				}else{
					return compareDays; 
				}
				
				
				
			}else{
				return compareNavroute; 
			}
			
			
		}else{
			return compareAgency; 
		}
		
		
		
		
	}


	public String buildNumberOfVehiclesForDisplay(){
		StringBuilder sb = new StringBuilder(""); 
		if(numberOfStandardBuses!=0){
			sb.append(numberOfStandardBuses + " Bus"); 
		}
		if(numberOfMiniBuses!=0){
			if(sb.length()>0){
				sb.append(" + ");
				
			}
			
			sb.append(numberOfMiniBuses + " Mini Bus");
		}
		
		
		
		
		return sb.toString(); 
		
		
	}
	
	
	public String getDayDateForDisplay(){
		Date date = LDateUtils.getDateFromNumericValueYYYYMMDD(daydate + ""); 
		if(date==null){
			return daydate + ""; 
		}
		String forDisplay = LDateUtils.getCETFormattedDate(date, "yyyy-MM-dd");
		return forDisplay; 
	}
	
	
	@Override
	public String toString() {
		return "PersistableDailyPlanningRecapModel [nbreOfEmployees="
				+ nbreOfEmployees + ", numberOfMiniBuses="
				+ numberOfMiniBuses + ", numberOfStandardBuses="
						+ numberOfStandardBuses
						+ ", propNbrOfVehiclesTextual="
						+ propNbrOfVehiclesTextual
						+ ", shiftStart=" + shiftStart
				+ ", shiftEnd=" + shiftEnd + ", agencyName=" + agencyName
				+ ", navRoute=" + navRoute + ", calendarWeek=" + calendarWeek
				+ ", dayOfWeek=" + dayOfWeek + ", dayDate=" + daydate + "]";
	}
	
	
}
