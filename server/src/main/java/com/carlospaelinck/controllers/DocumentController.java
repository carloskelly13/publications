package com.carlospaelinck.controllers;

import com.carlospaelinck.domain.Document;
import com.carlospaelinck.security.PubUserDetails;
import com.carlospaelinck.services.DocumentService;

import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.print.Doc;
import javax.xml.ws.Response;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping(value = "/documents")
public class DocumentController {
  private final DocumentService documentService;

  @Inject
  public DocumentController(DocumentService documentService) {
    this.documentService = documentService;
  }

  @RequestMapping(method = RequestMethod.GET)
  Set<Document> list(@AuthenticationPrincipal PubUserDetails userDetails) {
    return documentService.findAllByUser(userDetails.getUser(), new Sort(Sort.Direction.DESC, "lastModified"));
  }

  @RequestMapping(method = RequestMethod.POST)
  Document create(@AuthenticationPrincipal PubUserDetails userDetails, @RequestBody Document document) {
    document.setUser(userDetails.getUser());
    return documentService.create(document);
  }

  @RequestMapping(value = "/{documentId}", method = RequestMethod.GET)
  ResponseEntity<?> get(@PathVariable("documentId") String documentId) {
    Optional<Document> document = documentService.get(documentId);
    return document
      .<ResponseEntity<?>>map(doc -> new ResponseEntity<>(doc, HttpStatus.OK))
      .orElseGet(() -> new ResponseEntity<>(null, HttpStatus.NOT_FOUND));
  }

  @RequestMapping(value = "/{documentId}", method = RequestMethod.DELETE)
  ResponseEntity delete(@PathVariable("documentId") String documentId) {
    Boolean wasDeleted = documentService.delete(documentId);
    if (wasDeleted) {
      return new ResponseEntity(HttpStatus.OK);
    }
    return new ResponseEntity(HttpStatus.NOT_FOUND);
  }

  @RequestMapping(value = "/{documentId}", method = RequestMethod.PUT)
  Document update(@AuthenticationPrincipal PubUserDetails userDetails, @PathVariable("documentId") String documentId, @RequestBody Document document) {
    document.setId(documentId);
    document.setUser(userDetails.getUser());
    return documentService.update(document);
  }
}
