import database from "../../../../infra/database.js";

async function status(request, response) {
  const result = await database.query("SELECT 1 + 1 as resultadoquery;");
  console.log(result.rows);
  response
    .status(200)
    .json({ chave: "Opa aqui no json temos o charset-utf8. acento aqui ~^^~" });
}

export default status;
