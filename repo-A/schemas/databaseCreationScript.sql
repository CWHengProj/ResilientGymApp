drop database if exists resilient;
create database resilient;
use resilient;
-- create user 
create table users(
    email varchar(256) not null,
    username varchar(64) not null,
    constraint pk_email primary key (email)
);
create table exerciseHistory(
    id int auto_increment primary key,
    exerciseName varchar(256) not null,
    weightused float not null,
    reps int not null,
    datePerformed date not null,
    email varchar(256) not null,
    constraint fk_email foreign key (email) references users(email) on delete cascade
);
grant all privileges on exerciseHistory to 'fred'@'%';
grant all privileges on users to 'fred'@'%';
flush privileges;