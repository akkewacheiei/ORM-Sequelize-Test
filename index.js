const express = require("express");
const mysql = require("mysql2/promise");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
app.use(express.json());

// กำหนดพอร์ท
const port = 8000;

let conn = null;

// function init connection mysql
const initMySQL = async () => {
  conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "tutorial",
  });
};

// use sequenlize
const sequelize = new Sequelize("tutorial", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});

// เพิ่ม table User เข้ามา และ validation
const User = sequelize.define(
  "users",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      valipublishDate: {
        isEmail: true,
      },
    },
  },
  {}
);

// เพิ่ม table address เข้ามา
const Address = sequelize.define(
  "addresses",
  {
    address1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {}
);

User.hasMany(Address, { onDelete: "CASCADE" });
Address.belongsTo(User);

//เริ่ม API

// กำหนด route สำหรับ root URL
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/users", async (req, res) => {
  try {
    //const [result] = await conn.query("SELECT * FROM users");
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

app.get("/api/users/:id/address", async (req, res) => {
  const userId = req.params.id;
  try {
    /*  const [results] = await conn.query(
      ` SELECT users.*, addresses.* FROM users LEFT JOIN addresses ON users.id = addresses.userId WHERE users.id = ? `,
      userId
    ); */
    const results = await User.findOne({
      where: { id: userId },
      include: {
        model: Address,
      },
    });
    res.json(results);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

app.put("/api/users/:id", async (req, res) => {
  const userData = req.body;
  const userId = req.params.id;

  try {
    // แบบ Query แบบเก่า
    // const result = await conn.query("UPDATE users SET ? WHERE id = ?", [userData,userId,]);
    const user = await User.update(userData, { where: { id: userId } });
    const addressData = userData.addresses;
    let addressCreated = [];
    for (let i = 0; i < addressData.length; i++) {
      let cAddressData = addressData[i];
      cAddressData.userId = userId;
      const address = await Address.upsert(cAddressData);
      addressCreated.push(address);
    }
    res.json(user);
  } catch (error) {
    console.log(error);
  }
});

app.delete("/api/users/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    //const [result] = await conn.query('DELETE FROM users WHERE id = ?', [id])
    const result = await User.destroy({
      where: {
        id: userId,
      },
    });
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/users", async (req, res) => {
  const userData = req.body;
  try {
    /*    userData.createdAt = new Date();
    userData.updatedAt = new Date();
    const [result] = await conn.query("INSERT INTO users SET ?", userData);*/
    const user = await User.create(userData);
    const addressData = userData.addresses;
    let addressCreated = [];
    for (let i = 0; i < addressData.length; i++) {
      let cAddressData = addressData[i];
      console.log("cAddressData1 :", cAddressData);
      cAddressData.userId = user.id;
      console.log("cAddressData2 :", cAddressData);
      const address = await Address.create(cAddressData);
      addressCreated.push(address);
    }
    res.json({
      user,
      addresses: addressCreated,
    });
  } catch (error) {
    console.log("error :", error);
    res.json({
      message: "insert error",
      errors: error.errors.map((e) => e.message),
    });
  }
});

// เริ่มเซิร์ฟเวอร์
app.listen(port, async () => {
  await initMySQL();
  await sequelize.sync({ force: true });

  console.log(`Server is running on http://localhost:${port}`);
});
