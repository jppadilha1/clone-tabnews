function status(request, response) {
  response
    .status(200)
    .json({ chave: "Opa aqui no json temos o charset-utf8. acento aqui ~^^~" });
}

export default status;
