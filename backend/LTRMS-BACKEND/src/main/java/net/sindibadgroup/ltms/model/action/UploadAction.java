package net.sindibadgroup.ltms.model.action;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "action")
public class UploadAction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private Date creationDate;

    @Column
    private String userName;

    @Column(nullable = false)
    private String actionName;

    @Column(nullable = false)
    private String targetAction;

    @Column(nullable = false)
    private String orgName;

    @Column(nullable = false)
    private String status;

}