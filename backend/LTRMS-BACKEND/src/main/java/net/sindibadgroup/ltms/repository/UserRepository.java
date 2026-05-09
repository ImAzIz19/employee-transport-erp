package net.sindibadgroup.ltms.repository;

import net.sindibadgroup.ltms.model.user.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    Optional<UserEntity> findByEmail(String email);
    Optional<UserEntity> findById(Integer id);
    boolean existsByEmail(String email);
    @Query("SELECT u FROM UserEntity u JOIN FETCH u.roles")
    List<UserEntity> findAllWithRoles();
}