package net.sindibadgroup.ltms.model.permission;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "permission")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String permission;

    public static final Permission AGENCY_CREATE = Permission.builder().permission("agency:create").build();
    public static final Permission AGENCY_READ = Permission.builder().permission("agency:read").build();
    public static final Permission AGENCY_UPDATE = Permission.builder().permission("agency:update").build();
    public static final Permission AGENCY_DELETE = Permission.builder().permission("agency:delete").build();

    public static final Permission DRIVER_CREATE = Permission.builder().permission("driver:create").build();
    public static final Permission DRIVER_READ = Permission.builder().permission("driver:read").build();
    public static final Permission DRIVER_UPDATE = Permission.builder().permission("driver:update").build();
    public static final Permission DRIVER_DELETE = Permission.builder().permission("driver:delete").build();
    public static final Permission DRIVER_STATUS = Permission.builder().permission("driver:status").build();
    public static final Permission DRIVER_EXPORT = Permission.builder().permission("driver:export").build();

    public static final Permission VEHICLE_CREATE = Permission.builder().permission("vehicle:create").build();
    public static final Permission VEHICLE_READ = Permission.builder().permission("vehicle:read").build();
    public static final Permission VEHICLE_UPDATE = Permission.builder().permission("vehicle:update").build();
    public static final Permission VEHICLE_DELETE = Permission.builder().permission("vehicle:delete").build();
    public static final Permission VEHICLE_STATUS = Permission.builder().permission("vehicle:status").build();
    public static final Permission VEHICLE_EXPORT = Permission.builder().permission("vehicle:export").build();

    public static final Permission CIRCUIT_CREATE = Permission.builder().permission("circuit:create").build();
    public static final Permission CIRCUIT_READ = Permission.builder().permission("circuit:read").build();
    public static final Permission CIRCUIT_UPDATE = Permission.builder().permission("circuit:update").build();
    public static final Permission CIRCUIT_DELETE = Permission.builder().permission("circuit:delete").build();
    public static final Permission CIRCUIT_STATUS = Permission.builder().permission("circuit:status").build();

    public static final Permission EMPLOYEE_CREATE = Permission.builder().permission("employee:create").build();
    public static final Permission EMPLOYEE_READ = Permission.builder().permission("employee:read").build();
    public static final Permission EMPLOYEE_UPDATE = Permission.builder().permission("employee:update").build();
    public static final Permission EMPLOYEE_DELETE = Permission.builder().permission("employee:delete").build();
    public static final Permission EMPLOYEE_STATUS = Permission.builder().permission("employee:status").build();
    public static final Permission EMPLOYEE_IMPORT = Permission.builder().permission("employee:import").build();
    public static final Permission EMPLOYEE_EXPORT = Permission.builder().permission("employee:export").build();

    public static final Permission PLANIFICATION_READ = Permission.builder().permission("planification:read").build();
    public static final Permission PLANIFICATION_CREATE = Permission.builder().permission("planification:create").build();
    public static final Permission PLANIFICATION_EXPORT = Permission.builder().permission("planification:export").build();
    public static final Permission PLANIFICATION_MANUAL = Permission.builder().permission("planification:manual").build();
    public static final Permission PLANIFICATION_NOTIFICATION = Permission.builder().permission("planification:notification").build();

    public static final Permission PLANT_SECTION_CREATE = Permission.builder().permission("plant_section:create").build();
    public static final Permission PLANT_SECTION_READ = Permission.builder().permission("plant_section:read").build();
    public static final Permission PLANT_SECTION_UPDATE = Permission.builder().permission("plant_section:update").build();
    public static final Permission PLANT_SECTION_DELETE = Permission.builder().permission("plant_section:delete").build();
    public static final Permission PLANT_SECTION_STATUS = Permission.builder().permission("plant_section:status").build();

    public static final Permission SEGMENT_CREATE = Permission.builder().permission("segment:create").build();
    public static final Permission SEGMENT_READ = Permission.builder().permission("segment:read").build();
    public static final Permission SEGMENT_UPDATE = Permission.builder().permission("segment:update").build();
    public static final Permission SEGMENT_DELETE = Permission.builder().permission("segment:delete").build();
    public static final Permission SEGMENT_STATUS = Permission.builder().permission("segment:status").build();

    public static final Permission STATION_CREATE = Permission.builder().permission("station:create").build();
    public static final Permission STATION_READ = Permission.builder().permission("station:read").build();
    public static final Permission STATION_UPDATE = Permission.builder().permission("station:update").build();
    public static final Permission STATION_DELETE = Permission.builder().permission("station:delete").build();
    public static final Permission STATION_STATUS = Permission.builder().permission("station:status").build();
    public static final Permission STATION_IMPORT = Permission.builder().permission("station:import").build();
    public static final Permission STATION_EXPORT = Permission.builder().permission("station:export").build();


}