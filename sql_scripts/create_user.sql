CREATE USER 'chatovid'@'localhost' IDENTIFIED BY 'super_secret_password';

GRANT INSERT ON chatovid.* TO 'chatovid'@'localhost';
GRANT SELECT ON chatovid.* TO 'chatovid'@'localhost';
GRANT UPDATE ON chatovid.* TO 'chatovid'@'localhost';
GRANT DELETE ON chatovid.* TO 'chatovid'@'localhost';
