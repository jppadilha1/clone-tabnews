import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdateAt />
      <br />
      <Dependencies />
    </>
  );
}

function UpdateAt() {
  const response = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updateAtText = "Carregando...";

  if (!response.isLoading) {
    updateAtText = new Date(response.data.updated_at).toLocaleString("pt-BR");
  }

  return (
    <>
      <div>
        Última atualização:
        {updateAtText}
      </div>
    </>
  );
}

function Dependencies() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI);

  let infodb = "Carregando...";

  if (!isLoading && data) {
    infodb = (
      <>
        <div>Versão: {data.dependencies.database.version}</div>
        <div>
          Número máximo de conexões:{" "}
          {data.dependencies.database.max_connections}
        </div>
        <div>
          Conexões abertas: {data.dependencies.database.opened_connections}
        </div>
      </>
    );
  }

  return (
    <>
      <h2>Banco de Dados (Postgres):</h2>
      {infodb}
    </>
  );
}
