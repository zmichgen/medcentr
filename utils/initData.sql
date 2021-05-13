drop database if exists medicinfo;
create database if not exists medicinfo;
use medicinfo;
-- Услуги
create TABLE services(
  id int NOT NULL primary key AUTO_INCREMENT comment 'primary key',
  name varchar(255) comment 'наименование услуги'
) default charset utf8 comment '';
insert into
  services(name)
values
  ('Лечение зубов'),
  ('Услуги терапевта'),
  ('Услуги психиатра'),
  ('Услуги хирурга'),
  ('Услуги невропатолога'),
  ('Услуги лора'),
  ('Услуги окулиста'),
  ('Педиатрия'),
  ('Зубное протезирование');

  -- Специальности
  CREATE TABLE specializations(
    id int PRIMARY KEY AUTO_INCREMENT comment 'primary key',
    name VARCHAR(255) comment 'наименование специальности'
  ) default charset utf8 comment '';

  insert into specializations(name)
  values
  ('Теравпевт'),
    ('Хирург'),
      ('Зубной теравпевт'),
        ('Зубной хирург'),
          ('Окулист');

 -- Вид услуг
create TABLE service_types(
  id int NOT NULL primary key AUTO_INCREMENT comment 'primary key',
  name varchar(255) comment 'наименование вида услуг'
) default charset utf8 comment '';
insert into
  service_types(name)
values
  ('Платные'),
  ('Бесплатные');
-- Медцентры
  create  table centers(
    id int primary key auto_increment comment 'primary key',
    name varchar(255) not null comment 'наименование центра медуслуг',
    address varchar(255) not null comment 'адрес центра медуслуг',
    service_type_id int COMMENT 'id вида услуг',
    FOREIGN KEY(service_type_id) REFERENCES service_types(id)
  ) default charset utf8 comment '';
insert into
  centers(name, address, service_type_id)
values
  ('Больница 111', 'Минск', 1),
  ('Больница 16', 'Могилев', 1),
  ('Больница 21', 'Гомель', 2),
  ('Больница 133', 'Гродно', 1),
  ('Больница 12', 'Брест', 2),
  ('Больница 54', 'Витебск', 1);


CREATE TABLE centers_services(
  center_id int comment 'id центра',
  service_id int comment 'id услуги',
  FOREIGN KEY(center_id) REFERENCES centers(id),
  FOREIGN KEY (service_id) REFERENCES services(id)
) default charset utf8 comment '';

INSERT INTO centers_services(center_id, service_id)
values
(1, 1),
(1, 2),
(1, 3),
(2,4),(2,5),(2,6),
(3,1),(3,5),(3,7),
(4,4),(4,6),(4,7),
(5,2),(5,3),(5,6),
(6,7);

 -- Врачи
  CREATE TABLE doctors(
    id int PRIMARY KEY AUTO_INCREMENT comment 'primary key',
    name VARCHAR(255) comment 'Имя',
    surname VARCHAR(255) comment 'Фамилия',
    spec_id int comment 'id специальности из списка специальности',
    center_id int comment 'id мед центра в котором работает',
    FOREIGN KEY (spec_id) REFERENCES specializations(id),
    foreign key (center_id) references centers(id)
  ) default charset utf8 comment '';

  INSERT INTO doctors(
    name, surname, spec_id, center_id
  )
  values
  ('Иван','Иванов', 1, 1),
   ('Петр','Иванов', 2, 2),
    ('Иван','Петров', 3, 3),
     ('Петр','Петров', 4, 4),
      ('Иван','Сидоров', 5, 5);
