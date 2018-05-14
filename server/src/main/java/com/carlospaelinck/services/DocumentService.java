package com.carlospaelinck.services;

import com.carlospaelinck.domain.Document;
import com.carlospaelinck.domain.User;
import com.carlospaelinck.repositories.DocumentRepository;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import javax.inject.Inject;
import javax.transaction.Transactional;
import java.util.*;

@Service
@Transactional
public class DocumentService {
  private final DocumentRepository documentRepository;

  @Inject
  public DocumentService(DocumentRepository documentRepository) {
    this.documentRepository = documentRepository;
  }

  @PostAuthorize("isOwner(returnObject)")
  public Optional<Document> get(String id) {
    return documentRepository.findById(id);
  }

  public Set<Document> findAllByUser(User user, Sort sortOrder) {
    return documentRepository.findAllByUser(user, sortOrder);
  }

  public Document create(Document document) {
    document.setLastModified(new Date());
    document.setId(UUID.randomUUID().toString());
    document.getShapes().forEach(s -> s.setDocument(document));
    return documentRepository.save(document);
  }

  @PreAuthorize("isOwner(this.get(#document.id))")
  public Document update(Document document) {
    document.setLastModified(new Date());
    document.getShapes().forEach(s -> s.setDocument(document));
    return documentRepository.save(document);
  }

  @PreAuthorize("isOwner(this.get(#id))")
  public Boolean delete(String id) {
    Optional<Document> document = documentRepository.findById(id);
    if (document.isPresent()) {
      documentRepository.delete(document.get());
      return true;
    }
    return false;
  }
}
