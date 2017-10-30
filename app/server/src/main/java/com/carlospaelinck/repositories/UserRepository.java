package com.carlospaelinck.repositories;

import com.carlospaelinck.domain.User;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends PagingAndSortingRepository<User, String> {
  User findOneByEmailAddress(String email);
}
