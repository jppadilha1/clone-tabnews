import {
  MethodNotAllowedError,
  InternalServerError,
  ValidationError,
  NotFoundError
} from "infra/errors.js";

async function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();
  return response.status(publicErrorObject.status_code).json(publicErrorObject);
}

async function onErrorHandler(error, request, response) {

  if(error instanceof NotFoundError) {
    response.status(error.status_code).json(error)
  }

  if (error instanceof ValidationError) {
    response.status(error.status_code).json(error);
  }

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
