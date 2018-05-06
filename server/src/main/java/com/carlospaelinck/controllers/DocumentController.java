package com.carlospaelinck.controllers;

import com.carlospaelinck.domain.Document;
import com.carlospaelinck.security.PubUserDetails;
import com.carlospaelinck.services.DocumentService;

import org.springframework.data.domain.Sort;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.util.List;

@RestController
@RequestMapping(value = "/documents")
public class DocumentController {
  private final DocumentService documentService;

  @Inject
  public DocumentController(DocumentService documentService) {
    this.documentService = documentService;
  }

  @RequestMapping(method = RequestMethod.GET)
  List<Document> list(@AuthenticationPrincipal PubUserDetails userDetails) {
    return documentService.findAllByUser(userDetails.getUser(), new Sort(Sort.Direction.DESC, "lastModified"));
  }

  @RequestMapping(method = RequestMethod.POST)
  Document create(@AuthenticationPrincipal PubUserDetails userDetails, @RequestBody Document document) {
    document.setUser(userDetails.getUser());
    return documentService.create(document);
  }

  @RequestMapping(value = "/{documentId}", method = RequestMethod.GET)
  Document get(@PathVariable("documentId") String documentId) {
    return documentService.get(documentId);
  }

  @RequestMapping(value = "/{documentId}", method = RequestMethod.DELETE)
  void delete(@PathVariable("documentId") String documentId) {
    documentService.delete(documentId);
  }

  @RequestMapping(value = "/{documentId}", method = RequestMethod.PUT)
  Document update(@AuthenticationPrincipal PubUserDetails userDetails, @PathVariable("documentId") String documentId, @RequestBody Document document) {
    document.setId(documentId);
    document.setUser(userDetails.getUser());
    return documentService.update(document);
  }
}
