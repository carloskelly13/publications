package com.carlospaelinck.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
public class Shape {
  @Id
  @Getter
  @Setter
  @GeneratedValue(generator = "uuid")
  @GenericGenerator(name = "uuid", strategy = "uuid2")
  String id;

  @ManyToOne(targetEntity = Document.class, optional = false)
  @Getter
  @Setter
  @JsonIgnore
  @NotNull
  Document document;

  @NotNull
  @Getter
  @Setter
  String type;

  @NotNull
  @Getter
  @Setter
  Float width;

  @NotNull
  @Getter
  @Setter
  Float height;

  @NotNull
  @Getter
  @Setter
  Float x;

  @NotNull
  @Getter
  @Setter
  Float y;

  @NotNull
  @Getter
  @Setter
  Float z;

  @Getter
  @Setter
  Float r;

  @Getter
  @Setter
  Float angle;

  @Getter
  @Setter
  Float strokeWidth;

  @Getter
  @Setter
  String fill;

  @Getter
  @Setter
  String color;

  @Getter
  @Setter
  String stroke;

  @Getter
  @Setter
  Float fillOpacity;

  @Getter
  @Setter
  Float strokeOpacity;

  @Getter
  @Setter
  @Column(columnDefinition = "text")
  String text;
}
