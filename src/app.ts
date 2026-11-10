import express from "express";
import path from "node:path";
import nunjucks from "nunjucks";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const viewDir = path.resolve("views");
const publicDir = path.resolve("public");

nunjucks.configure(viewDir, { autoescape: true, express: app, watch: true });
app.set("view engine", "html");
app.use(express.static(publicDir));

app.get("/", (_req, res) => {
  res.render("index.njk");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
