import mysql from "mysql2/promise"

// 创建连接池而不是单个连接
export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "social_media",
  connectionLimit: 10, // 最大连接数
  waitForConnections: true,
  queueLimit: 0
});

// 简单的测试查询来验证连接
async function testConnection() {
  try {
    const [rows] = await db.query("SELECT 1");
    console.log('数据库连接成功！');
  } catch (err) {
    console.error('数据库连接错误:', err);
  }
}

(async _=>{
  // console.log('准备查询');
  
  // db.query(`SELECT * FROM users`, [],(err, data) => {
  //   console.log(data);
  // });

  
  // const q =
  //   "INSERT INTO posts(`description`, `img`, `createdAt`, `userId`) VALUES (?)";
  // const values = ['123', '', '2025-04-19 16:27:52', 7];

  // const [data] = await db.query(q, [values]);
  // console.log(data);
  
})()

testConnection();