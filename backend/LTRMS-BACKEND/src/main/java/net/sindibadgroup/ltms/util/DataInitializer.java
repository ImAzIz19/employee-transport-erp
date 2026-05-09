package net.sindibadgroup.ltms.util;

import net.sindibadgroup.ltms.model.agency.Agency;
import net.sindibadgroup.ltms.model.circuit.Circuit;
import net.sindibadgroup.ltms.model.employee.Employee;
import net.sindibadgroup.ltms.model.plant_section.PlantSection;
import net.sindibadgroup.ltms.model.role.Role;
import net.sindibadgroup.ltms.model.segment.Segment;
import net.sindibadgroup.ltms.model.shift.Shift;
import net.sindibadgroup.ltms.model.station.Station;
import net.sindibadgroup.ltms.model.user.UserEntity;
import net.sindibadgroup.ltms.model.permission.Permission;
import net.sindibadgroup.ltms.repository.AgencyRepository;
import net.sindibadgroup.ltms.repository.CircuitRepository;
import net.sindibadgroup.ltms.repository.EmployeeRepository;
import net.sindibadgroup.ltms.repository.PlantSectionRepository;
import net.sindibadgroup.ltms.repository.RoleRepository;
import net.sindibadgroup.ltms.repository.SegmentRepository;
import net.sindibadgroup.ltms.repository.ShiftRepository;
import net.sindibadgroup.ltms.repository.StationRepository;
import net.sindibadgroup.ltms.repository.UserRepository;
import net.sindibadgroup.ltms.repository.PermissionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private CircuitRepository circuitRepository;

    @Autowired
    private AgencyRepository agencyRepository;

    @Autowired
    private PlantSectionRepository plantSectionRepository;

    @Autowired
    private SegmentRepository segmentRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ShiftRepository shiftRepository;

    @Autowired
    private StationRepository stationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        logger.info("Starting circuit, segment, employee, shift, station, and user initialization");

        Agency agency = agencyRepository.findByMatricule("LEONI-001")
                .orElseGet(() -> {
                    logger.info("Creating new Agency with matricule LEONI-001");
                    Agency newAgency = new Agency();
                    newAgency.setName("LEONI Sousse Agency");
                    newAgency.setAddress("Sousse Industrial Zone");
                    newAgency.setNomDeEntreprise("LEONI");
                    newAgency.setEmail("savageyt6@gmail.com");
                    newAgency.setNumeroDeTelephone("12345678");
                    newAgency.setMatricule("LEONI-001");
                    newAgency.setHoraireDeTravail("08:00-17:00");
                    newAgency.setSiteInternet("http://www.leoni.com");
                    newAgency.setActive(true);
                    Agency savedAgency = agencyRepository.save(newAgency);
                    logger.info("Saved Agency with ID: {}", savedAgency.getId());
                    return savedAgency;
                });

        String leoniSapReference = "5023";
        String pathReference = "Jwaouda-Dar Jamiia";
        Circuit circuit = circuitRepository.findByLeoniSapReference(leoniSapReference)
                .orElseGet(() -> {
                    logger.info("Creating new Circuit with leoniSapReference: {}", leoniSapReference);
                    Circuit newCircuit = Circuit.builder()
                            .leoniSapReference(leoniSapReference)
                            .pathReference(pathReference)
                            .numberOfKilometres(0)
                            .employeeContribution(0)
                            .kilometreCost(0)
                            .arrivalPoint("Unknown")
                            .agency(agency)
                            .isActive(true)
                            .build();
                    Circuit savedCircuit = circuitRepository.save(newCircuit);
                    logger.info("Saved Circuit with ID: {}", savedCircuit.getId());
                    return savedCircuit;
                });

        String stationName = "Main Station";
        Station station = stationRepository.findByName(stationName)
                .orElseGet(() -> {
                    logger.info("Creating new Station with name: {}", stationName);
                    Station newStation = Station.builder()
                            .name(stationName)
                            .refRegion("Sousse")
                            .refSapLeoni(5023.0)
                            .longitude(35.8256)
                            .latitude(10.6411)
                            .radius(100.0)
                            .isActive(true)
                            .circuit(circuit)
                            .build();
                    Station savedStation = stationRepository.save(newStation);
                    logger.info("Saved Station with ID: {}", savedStation.getId());
                    return savedStation;
                });

        String plantSectionName = "MH2";
        PlantSection plantSection = plantSectionRepository.findByName(plantSectionName)
                .orElseGet(() -> {
                    logger.info("Creating new PlantSection with name: {}", plantSectionName);
                    PlantSection newPlantSection = PlantSection.builder()
                            .name(plantSectionName)
                            .description("Main Hub 2")
                            .emplacement("North Facility")
                            .organization("Logistics")
                            .isActive(true)
                            .build();
                    PlantSection savedPlantSection = plantSectionRepository.save(newPlantSection);
                    logger.info("Saved PlantSection with ID: {}", savedPlantSection.getId());
                    return savedPlantSection;
                });

        String segmentName1 = "Warehouse Management MH2";
        Segment segment1 = segmentRepository.findByName(segmentName1)
                .orElseGet(() -> {
                    logger.info("Creating new Segment with name: {}", segmentName1);
                    Segment newSegment = Segment.builder()
                            .name(segmentName1)
                            .costCenter("4123")
                            .sapRef("MH2-WM")
                            .plantSection(plantSection)
                            .isActive(true)
                            .build();
                    Segment savedSegment = segmentRepository.save(newSegment);
                    logger.info("Saved Segment with ID: {}", savedSegment.getId());
                    return savedSegment;
                });

        String segmentName2 = "Inventory Control MH2";
        Segment segment2 = segmentRepository.findByName(segmentName2)
                .orElseGet(() -> {
                    logger.info("Creating new Segment with name: {}", segmentName2);
                    Segment newSegment = Segment.builder()
                            .name(segmentName2)
                            .costCenter("4124")
                            .sapRef("MH2-IC")
                            .plantSection(plantSection)
                            .isActive(true)
                            .build();
                    Segment savedSegment = segmentRepository.save(newSegment);
                    logger.info("Saved Segment with ID: {}", savedSegment.getId());
                    return savedSegment;
                });

        initializeShifts();

        initializeEmployees(plantSection, segment1, segment2, station);

        initializeUserWithPermissions();

        logger.info("Circuit, segment, employee, shift, station, and user initialization completed");
    }

    private void initializeShifts() {
        String[][] shiftData = {
                {"06:30", "14:45", "STANDARD"},
                {"14:45", "22:00", "STANDARD"},
                {"22:00", "06:30", "NIGHT"},
                {"06:00", "14:00", "STANDARD"},
                {"14:00", "21:30", "STANDARD"},
                {"21:30", "06:00", "NIGHT"}
        };

        for (String[] data : shiftData) {
            String startTime = data[0];
            String endTime = data[1];
            String mode = data[2];

            if (shiftRepository.findByStartTimeAndEndTime(startTime, endTime).isEmpty()) {
                logger.info("Creating new Shift with startTime: {} and endTime: {}", startTime, endTime);
                Shift shift = Shift.builder()
                        .startTime(startTime)
                        .endTime(endTime)
                        .mode(mode)
                        .build();
                Shift savedShift = shiftRepository.save(shift);
                logger.info("Saved Shift with ID: {}, startTime: {}, endTime: {}, mode: {}",
                        savedShift.getId(), startTime, endTime, mode);
            } else {
                logger.info("Shift with startTime: {} and endTime: {} already exists", startTime, endTime);
            }
        }
    }

    private void initializeEmployees(PlantSection plantSection, Segment segment1, Segment segment2, Station station) {
        String[][] employeeData = {
                {"22221111", "foule", "foulani"},
                {"10114832", "Hajer", "Ben Boubaker"},
                {"10114833", "Halima", "Ayadi"},
                {"10114834", "Mouadh", "Belarbi"},
                {"10114835", "Mohamed", "Ben Salah"},
                {"10114836", "Marouen", "Bensaad"},
                {"10114837", "Sofiene", "Boughanmi"}
        };

        int employeeCounter = 0;
        for (String[] data : employeeData) {
            long serialNumber = Long.parseLong(data[0]);
            String firstName = data[1];
            String lastName = data[2];

            if (employeeRepository.findBySerialNumber(serialNumber).isEmpty()) {
                logger.info("Creating new Employee with serialNumber: {}", serialNumber);
                Employee employee = Employee.builder()
                        .serialNumber(serialNumber)
                        .firstName(firstName)
                        .lastName(lastName)
                        .againstMaster("N/A")
                        .groupName("Default Group")
                        .direct(true)
                        .plantSection(plantSection)
                        .station(station)
                        .phoneNumber(12345678 + employeeCounter)
                        .costCenter(4100 + employeeCounter)
                        .segment(employeeCounter % 2 == 0 ? segment1 : segment2)
                        .isActive(true)
                        .isActiveForPlanification(true)
                        .build();
                Employee savedEmployee = employeeRepository.save(employee);
                logger.info("Saved Employee with ID: {}", savedEmployee.getId());
                employeeCounter++;
            } else {
                logger.info("Employee with serialNumber: {} already exists", serialNumber);
            }
        }
    }

    private void initializeUserWithPermissions() {
        String email = "admin@leoni.com";
        String password = "admin123";
        String roleName = "ROLE_ADMIN";

        if (userRepository.findByEmail(email).isEmpty()) {
            logger.info("Creating new User with email: {}", email);

            Set<Permission> permissions = new HashSet<>();
            for (String perm : List.of("agency:create", "agency:read", "agency:update", "agency:delete")) {
                permissions.add(permissionRepository.findByPermission(perm)
                        .orElseGet(() -> {
                            logger.info("Creating new Permission: {}", perm);
                            Permission newPermission = Permission.builder()
                                    .permission(perm)
                                    .build();
                            Permission savedPermission = permissionRepository.save(newPermission);
                            logger.info("Saved Permission with ID: {}", savedPermission.getId());
                            return savedPermission;
                        }));
            }

            Role role = roleRepository.findByName(roleName)
                    .orElseGet(() -> {
                        logger.info("Creating new Role with name: {}", roleName);
                        Role newRole = Role.builder()
                                .name(roleName)
                                .permissions(permissions)
                                .build();
                        Role savedRole = roleRepository.save(newRole);
                        logger.info("Saved Role with ID: {}", savedRole.getId());
                        return savedRole;
                    });

            UserEntity user = UserEntity.builder()
                    .firstName("Admin")
                    .lastName("User")
                    .loginName("Admin Login Name")
                    .orgId(1)
                    .email(email)
                    .password(passwordEncoder.encode(password))
                    .isVerified(true)
                    .roles(new HashSet<>(Set.of(role)))
                    .build();
            UserEntity savedUser = userRepository.save(user);
            logger.info("Saved User with ID: {}", savedUser.getId());
        } else {
            logger.info("User with email: {} already exists", email);
        }
    }
}