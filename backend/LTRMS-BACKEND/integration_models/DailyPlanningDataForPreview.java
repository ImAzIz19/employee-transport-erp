package com.emerald.ltms.manager.dataobjs;

import com.emerald.ltms.entities.Agency;
import com.emerald.ltms.entities.NavigationRoute;

public class DailyPlanningDataForPreview {
	
	private String weekCalendar = null;
	private String shiftStart = null; 
	private String shiftEnd = null;
	private String dayOfWeek; 
	private long dayDate; 
	private boolean  closed = false; 
	private String  key = null; 
	private int numberOfEmployees; 
	private String navigationRouteRef = null;
	private NavigationRoute navigationRouteObject = null;
	private String agencyName = null;
	private Agency agencyObject = null; 
	private String employeeFullName = null;
	private String employeeFactoryNumber = null;
	private String routePoint = null; 
	private boolean sendToAgency = true;
	private String notificationFileAbsolutePath = null;
	private int nbreOfVehicles; 
	private Long navRouteId; 
	
	
	private Integer gridId; 
	private boolean isCheckedForSending = false; 
	
	
	
	
	
	
	
	
	public void setDayDate(long dayDate) {
		this.dayDate = dayDate;
	}
	
	
	public long getDayDate() {
		return dayDate;
	}
	
	
	
	
	private String psName = null; 
	
	
	public void setNotificationFileAbsolutePath(String notificationFileName) {
		this.notificationFileAbsolutePath = notificationFileName;
	}
	
	public String getNotificationFileAbsolutePath() {
		return notificationFileAbsolutePath;
	}
	
	
	
	public void setRoutePoint(String routePoint) {
		this.routePoint = routePoint;
	}
	
	
	public String getRoutePoint() {
		return routePoint;
	}
	
	
	public void setNavRouteId(Long navRouteId) {
		this.navRouteId = navRouteId;
	}
	
	
	public Long getNavRouteId() {
		return navRouteId;
	}
	
	
	
	
	public void setNavigationRouteRef(String navigationRouteRef) {
		this.navigationRouteRef = navigationRouteRef;
	}
	
	
	public String getNavigationRouteRef() {
		return navigationRouteRef;
	}
	public void setNavigationRouteObject(NavigationRoute navigationRouteObject) {
		this.navigationRouteObject = navigationRouteObject;
	}
	
	public NavigationRoute getNavigationRouteObject() {
		return navigationRouteObject;
	}
	
	public boolean isSendToAgency() {
		return sendToAgency;
	}
	
	
	public void setSendToAgency(boolean sendToAgency) {
		this.sendToAgency = sendToAgency;
	}
	
	
	
	
	public String getWeekCalendar() {
		return weekCalendar;
	}
	public void setWeekCalendar(String weekCalendar) {
		this.weekCalendar = weekCalendar;
	}
	public String getShiftStart() {
		if(shiftStart!=null && !shiftStart.equals("")){
			if(shiftStart.length()==3){
				shiftStart = "0" + shiftStart;
			}
		}
		return shiftStart;
	}
	public void setShiftStart(String shiftStart) {
		this.shiftStart = shiftStart;
	}
	public String getShiftEnd() {
		if(shiftEnd!=null && !shiftEnd.equals("")){
			if(shiftEnd.length()==3){
				shiftEnd = "0" + shiftEnd;
			}
		}
		
		return shiftEnd;
	}
	public void setShiftEnd(String shiftEnd) {
		this.shiftEnd = shiftEnd;
	}
	public boolean isClosed() {
		return closed;
	}
	public void setClosed(boolean closed) {
		this.closed = closed;
	}
	public int getNumberOfEmployees() {
		return numberOfEmployees;
	}
	public void setNumberOfEmployees(int numberOfEmployees) {
		this.numberOfEmployees = numberOfEmployees;
	}
	public String getKey() {
		return key;
	}
	public void setKey(String key) {
		this.key = key;
	}


	public void setAgencyName(String corporateName) {
		agencyName = corporateName; 
		
	}
	
	public String getAgencyName() {
		return agencyName;
	}
	public void setAgencyObject(Agency agencyObject) {
		this.agencyObject = agencyObject;
	}
	
	public Agency getAgencyObject() {
		return agencyObject;
	}
	
	public String getRouteAgencyForDisplay(){
		return navigationRouteRef + " (" + agencyName + ")";
	}


	public String getEmployeeFullName() {
		return employeeFullName;
	}


	public void setEmployeeFullName(String employeeFullName) {
		this.employeeFullName = employeeFullName;
	}


	public String getEmployeeFactoryNumber() {
		return employeeFactoryNumber;
	}


	public void setEmployeeFactoryNumber(String employeeFactoryNumber) {
		this.employeeFactoryNumber = employeeFactoryNumber;
	}
	
	public void setPsName(String psName) {
		this.psName = psName;
	}
	
	
	public String getPsName() {
		return psName;
	}


	public boolean isCheckedForSending() {
		return isCheckedForSending;
	}


	public void setCheckedForSending(boolean isCheckedForSending) {
		this.isCheckedForSending = isCheckedForSending;
	}


	
	
	public void setGridId(Integer gridId) {
		this.gridId = gridId;
	}
	
	
	public Integer getGridId() {
		return gridId;
	}


	public void setDayOfWeek(String dayOfWeek) {
		this.dayOfWeek = dayOfWeek;
	}
	
	
	public String getDayOfWeek() {
		return dayOfWeek;
	}
	
	
	public void setNbreOfVehicles(int nbreOfVehicles) {
		this.nbreOfVehicles = nbreOfVehicles;
	}
	
	
	public int getNbreOfVehicles() {
		return nbreOfVehicles;
	}


	@Override
	public String toString() {
		return "DailyPlanningDataForPreview [weekCalendar=" + weekCalendar
				+ ", shiftStart=" + shiftStart + ", shiftEnd=" + shiftEnd
				+ ", dayOfWeek=" + dayOfWeek + ", dayDate=" + dayDate
				+ ", closed=" + closed + ", key=" + key
				+ ", numberOfEmployees=" + numberOfEmployees
				+ ", navigationRouteRef=" + navigationRouteRef
				+ ", navigationRouteObject=" + navigationRouteObject
				+ ", agencyName=" + agencyName + ", agencyObject="
				+ agencyObject + ", employeeFullName=" + employeeFullName
				+ ", employeeFactoryNumber=" + employeeFactoryNumber
				+ ", routePoint=" + routePoint + ", sendToAgency="
				+ sendToAgency + ", notificationFileAbsolutePath="
				+ notificationFileAbsolutePath + ", nbreOfVehicles="
				+ nbreOfVehicles + ", navRouteId=" + navRouteId + ", gridId="
				+ gridId + ", isCheckedForSending=" + isCheckedForSending
				+ ", psName=" + psName + "]";
	}
	
	
	
	
	
	
}
