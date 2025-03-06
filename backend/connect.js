import mysql from "mysql2";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Csc81357791.",
  database: "ConnectSphere",
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from("Csc81357791."),
  },
});
