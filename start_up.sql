/*drop table contacts;
drop table sess_user;
drop table session;
drop table users*/

/*Session Users*/
CREATE TABLE users
(
    user_id SERIAL primary key,
    username varchar(20) COLLATE pg_catalog."default" NOT NULL unique,
    password varchar(20) COLLATE pg_catalog."default" NOT NULL unique,
	fname varchar(20) NOT NULL,
	lname varchar(20) NOT NULL,
	p_numbers varchar(20),
	locate varchar(50)
);

insert into users(username, password, fname, lname) values('Thamy', 'LisiWoo', 'Thaman', 'Woo');

/*Session Table*/
Create table session
(
	sid varchar not null collate "default",
	sess json not null,
	expire timestamp(6) not null
)
with (OIDS=FALSE);
ALTER TABLE session add constraint "session_pkey" primary key (sid) not deferrable initially immediate;


/*Creation of the sess_user thing*/
create table sess_user (
	sid varchar not null collate "default",
	user_id integer not null
);

ALTER TABLE sess_user
   ADD CONSTRAINT for_user_id
   FOREIGN KEY (user_id) 
   REFERENCES users(user_id);
   
ALTER TABLE sess_user
   ADD CONSTRAINT for_sid
   FOREIGN KEY (sid) 
   REFERENCES session(sid) ON DELETE CASCADE;
   


/*insert into sess_user(sid, user_id) values ('8bzl6ObDsg4pR0ns6TmkgjhzNG5LztbM', 1) *//*Use this line to store*/


/*Contacts Table*/
CREATE TABLE contacts
(
    cont_id serial,
    user_id integer not null,
    firstname varchar(20) not null COLLATE pg_catalog."default" not null,
    lastname varchar(20) not null COLLATE pg_catalog."default" not null,
    address varchar(50) COLLATE pg_catalog."default",
    phone varchar(15) COLLATE pg_catalog."default",
	FOREIGN KEY (user_id) REFERENCES users(user_id),
	Primary key (cont_id, user_id)
)
WITH (
    OIDS = FALSE
);

insert into contacts(user_id, firstname, lastname, address, phone) values (1, 'Li', 'Pho', 'Scott Road Station, 110th Ave, Surrey, BC', '604 772 3534');
insert into contacts(user_id, firstname, lastname, address, phone) values (1, 'Sam', 'Pho', 'Scott Road Station, 110th Ave, Surrey, BC', '604 232 8762')

/*
select * from contacts;
select * from session;
select * from sess_user;
select * from users
*/

/*select * from (select * from users where user_id = 2) n1 left join (select * from contacts) n2 on (n1.user_id =n2.user_id)*/

/*update users set p_numbers = '604 223 9341', locate = '11485 128 Street' where user_id = 1*/