import { MethodNotAllowedError, InternalServerError } from "infra/errors.js";

async function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();
  return response.status(publicErrorObject.status_code).json(publicErrorObject);
}

async function onErrorHandler(error, request, response) {
  const publicErrorObject = new InternalServerError({
    cause: error,
    statusCode: error.status_code,
  });

  console.log("\nErro no catch do next-Connect:");
  console.error(publicErrorObject);
  response.status(publicErrorObject.status_code).json(publicErrorObject);
}

const controller = {
  onErrorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
