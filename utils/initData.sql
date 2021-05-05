drop database if exists medicinfo;
create database if not exists medicinfo;
-- Услуги
CREATE TABLE services(
  id int NOT NULL primary key AUTO_INCREMENT comment 'primary key',
  name varchar(255) comment 'наименование услуги'
) default charset utf8 comment '';
use medicinfo;
-- Вид услуг
CREATE TABLE service_types(
  id int NOT NULL primary key AUTO_INCREMENT comment 'primary key',
  name varchar(255) comment 'наименование вида услуг'
) default charset utf8 comment '';
insert into
  service_types(name)
values
  ('Платные'),
  ('Бесплатные');
-- Медцентры
  create table centers(
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
