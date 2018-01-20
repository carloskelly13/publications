package com.carlospaelinck.repositories;

import com.carlospaelinck.domain.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends CrudRepository<User, String> {
  User findOneByEmailAddress(String email);
}
