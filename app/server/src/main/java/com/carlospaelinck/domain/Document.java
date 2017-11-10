package com.carlospaelinck.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

@Entity
public class Document {
  @Id
  @Getter
  @Setter
  @GeneratedValue(generator = "uuid")
  @GenericGenerator(name = "uuid", strategy = "uuid2")
  String id;

  @ManyToOne(targetEntity = User.class, optional = false)
  @Getter
  @Setter
  @JsonIgnore
  @NotNull
  User user;

  @NotNull
  @Getter
  @Setter
  String name;

  @NotNull
  @Getter
  @Setter
  Float width;

  @NotNull
  @Getter
  @Setter
  Float height;

  @Getter
  @Setter
  Date lastModified;

  @OneToMany(targetEntity = Shape.class, cascade = CascadeType.ALL)
  @Getter
  @Setter
  List<Shape> shapes;
}
