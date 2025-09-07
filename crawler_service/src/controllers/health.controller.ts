import express from "express";

async function getHealth(req: express.Request, res: express.Response) {
  res.status(200).json({ message: "Hello, World", service: "crawler-service" });
}

export { getHealth };
