import user from "models/user.js";
import password from "models/password.js";
import { UnauthorizedError, NotFoundError } from "infra/errors.js";

async function getAuthenticatedUser(emailProvided, passwordProvided) {
  try {
    const storedUser = await findOneByEmail(emailProvided);
    await comparePasswords(passwordProvided, storedUser.password);

    return storedUser;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "Dados de Autenticação não conferem.",
        action: "Verifique se os dados enviados estão corretos.",
      });
    }
    throw error;
  }

  async function findOneByEmail(email) {
    try {
      const foundUser = await user.findOneByEmail(email);
      return foundUser;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new UnauthorizedError({
          message: "Email não confere.",
          action: "Verifique se os dados enviados estão corretos.",
        });
      }
      throw error;
    }
  }

  async function comparePasswords(passwordProvided, passwordStored) {
    const isMatch = await password.compare(passwordProvided, passwordStored);

    if (!isMatch) {
      throw new UnauthorizedError({
        message: "Senha não confere.",
        action: "Verifique se os dados enviados estão corretos.",
      });
    }
  }
}

const authentication = {
  getAuthenticatedUser,
};

export default authentication;
