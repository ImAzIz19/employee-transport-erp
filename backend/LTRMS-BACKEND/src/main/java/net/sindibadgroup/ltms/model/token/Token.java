package net.sindibadgroup.ltms.model.token;


import net.sindibadgroup.ltms.model.user.UserEntity;
import jakarta.persistence.*;
import lombok.*;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Token {

    @Id
    @GeneratedValue
    private Integer id;

    @Column(name = "token", length = 2048)
    private String token;

    @Enumerated(EnumType.STRING)
    private TokenType tokenType ;

    private boolean expired;

    private boolean revoked;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;
}
