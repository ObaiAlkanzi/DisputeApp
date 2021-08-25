select * from users
insert into users values ('obai','123','4')
insert into users values ('admin','123','4')
insert into users values ('OH000000','123','1')
update users set creation_date = getdate()
select * from visualTrans
delete from visualTrans where rrn = '21128131062104349817'
insert into VisualTrans(rrn,user_name,branch,send_date,state,PAY_AMT,PAY_CURR,feedback,employee) values(rand(16),'51262186','102',getdate(),'W','1000','934','-','OH000000')
/*
create table users(name varchar(15) primary key,password varchar(100),accessLevel varchar(2),id int identity(1,1),create_date datetime)
drop table users
update users set accessLevel = 4 where id in(1,2)
update users set password = 123
update VisualTrans set employee = 'OH200045'
update visualTrans set state = 'W' , feedback = 'DDDD' where rrn like '%2118810106202104207%' 
update visualTrans set state = 'W'

delete from visualTrans
alter table users add creation_date datetime
alter table VisualTrans add employee text

*/
1912820809151089870
21128131062104349817