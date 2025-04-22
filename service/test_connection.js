import mysql from "mysql2/promise";

async function testConnection() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "acdb1342", 
    database: "social_media"
  });

  try {
    const [rows] = await connection.query("SELECT 1 as result");
    console.log("连接成功! 结果:", rows);
    await connection.end();
  } catch (err) {
    console.error("连接错误:", err);
  }
}

testConnection()
  .then(() => console.log("测试完成"))
  .catch(err => console.error("测试失败:", err)); 