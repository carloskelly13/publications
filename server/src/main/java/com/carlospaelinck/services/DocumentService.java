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
import java.util.Date;
import java.util.List;

@Service
@Transactional
public class DocumentService {
  private final Sort sortOrder = new Sort(Sort.Direction.DESC, "lastModified");

  @Inject
  private DocumentRepository documentRepository;

  @PostAuthorize("isOwner(returnObject)")
  public Document get(String id) {
    return documentRepository.findOne(id);
  }

  public List<Document> findAllByUser(User user) {
    return documentRepository.findAllByUser(user, sortOrder);
  }

  public Document create(Document document) {
    document.setLastModified(new Date());
    return documentRepository.save(document);
  }

  @PreAuthorize("isOwner(this.get(#document.id))")
  public Document update(Document document) {
    document.setLastModified(new Date());
    return documentRepository.save(document);
  }

  @PreAuthorize("isOwner(this.get(#id))")
  public void delete(String id) {
    Document document = get(id);
    documentRepository.delete(document);
  }

  @PreAuthorize("isOwner(document)")
  public void delete(Document document) {
    documentRepository.delete(document);
  }
}
