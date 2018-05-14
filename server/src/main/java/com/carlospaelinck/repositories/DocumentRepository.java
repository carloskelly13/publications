package com.carlospaelinck.repositories;

import com.carlospaelinck.domain.Document;
import com.carlospaelinck.domain.User;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import java.util.Set;

@Repository
public interface DocumentRepository extends PagingAndSortingRepository<Document, String> {
  Set<Document> findAllByUser(User user, Sort sort);
}
