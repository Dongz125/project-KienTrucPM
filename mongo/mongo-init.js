db = db.getSiblingDB("promptpal");

console.log(`Creating for ${process.env.MONGO_USER}:${process.env.MONGO_PASS}`);
db.createUser({
  user: process.env.MONGO_USER,
  pwd: process.env.MONGO_PASS,
  roles: [{ role: "readWrite", db: process.env.MONGO_INITDB_DATABASE }],
});
