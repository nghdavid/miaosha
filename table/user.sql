USE miaosha;
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `user`;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE user (
	id mediumint unsigned NOT NULL auto_increment,
  email varchar(50) NOT NULL UNIQUE,
  password char(60),
  name varchar(20) NOT NULL,
  role_id boolean NOT NULL default 0,
  primary key (id)
)