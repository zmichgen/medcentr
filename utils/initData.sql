drop database if exists medicinfo;
create database if not exists medicinfo;
use medicinfo;
create table centers(id int primary key auto_increment, name varchar(255) not null, num int not null, address varchar(255) not null);

insert into centers(num, name, address)
values
(1, 'Больница 111', 'Минск'),
(2, 'Больница 16', 'Могилев'),
(3, 'Больница 21', 'Гомель'),
(4, 'Больница 133', 'Гродно'),
(5, 'Больница 12', 'Брест'),
(6, 'Больница 54', 'Витебск');