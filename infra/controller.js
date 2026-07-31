import * as cookie from "cookie";
import session from "models/session";
import {
  MethodNotAllowedError,
  InternalServerError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
} from "infra/errors.js";

async function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();
  return response.status(publicErrorObject.status_code).json(publicErrorObject);
}

async function onErrorHandler(error, request, response) {
  if (error instanceof NotFoundError) {
    response.status(error.status_code).json(error);
  }

  if (error instanceof ValidationError) {
    response.status(error.status_code).json(error);
  }

  if (error instanceof UnauthorizedError) {
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

function setSessionCookie(newSessionToken, response) {
  const setCookie = cookie.serialize("session_id", newSessionToken, {
    path: "/",
    maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
    secure: process.env.NODE_ENV == "production",
    httpOnly: true,
  });

  response.setHeader("Set-Cookie", setCookie);
}

const controller = {
  onErrorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
  setSessionCookie,
};

export default controller;
