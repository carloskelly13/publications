package com.carlospaelinck.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.List;

@Entity
@Table(name = "\"user\"")
public class User {
  @Id
  @Getter
  @Setter
  @GeneratedValue(generator = "uuid")
  @GenericGenerator(name = "uuid", strategy = "uuid2")
  String id;

  @NotNull
  @Getter
  @Setter
  @Column(unique=true)
  String emailAddress;

  @NotNull
  @Getter
  @Setter
  @JsonIgnore
  String passwordHash;

  @Transient
  String password;

  @NotNull
  @Getter
  @Setter
  Boolean temporary;

  @OneToMany(targetEntity = Document.class, mappedBy = "user")
  @Getter
  @Setter
  @JsonIgnore
  List<Document> documents;

  @JsonIgnore
  public String getPassword() {
    return password;
  }

  @JsonProperty
  public void setPassword(String password) {
    this.password = password;
  }
}
