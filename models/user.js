import database from "infra/database.js";
import password from "models/password.js";
import { NotFoundError, ValidationError } from "infra/errors.js";

async function findOneByUsername(username) {
  const foundUser = await runSelectQuery(username);

  return foundUser;

  async function runSelectQuery(username) {
    const results = await database.query({
      text: `
    SELECT  
      *
    FROM 
      users
    WHERE
      LOWER(username) = LOWER($1)
    LIMIT
      1
    ;`,

      values: [username],
    });

    if (results.rowCount !== 1) {
      throw new NotFoundError({
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique se o username está digitado corretamente.",
      });
    }

    return results.rows[0];
  }
}

async function findOneByEmail(email) {
  const foundUser = await runSelectQuery(email);

  return foundUser;

  async function runSelectQuery(email) {
    const results = await database.query({
      text: `
    SELECT  
      *
    FROM 
      users
    WHERE
      LOWER(email) = LOWER($1)
    LIMIT
      1
    ;`,

      values: [email],
    });

    if (results.rowCount !== 1) {
      throw new NotFoundError({
        message: "O email informado não foi encontrado no sistema.",
        action: "Verifique se o email está digitado corretamente.",
      });
    }

    return results.rows[0];
  }
}

async function create(userInputValues) {
  await ValidateUniqueEmail(userInputValues.email);
  await ValidateUniqueUsername(userInputValues.username);
  await hashPasswordInObject(userInputValues);

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function runInsertQuery(userInputValues) {
    const results = await database.query({
      text: `
    INSERT INTO 
      users (username, email, password)
    VALUES 
      ($1, $2, $3)
    RETURNING
      *  
    `,

      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });
    return results.rows[0];
  }
}

async function ValidateUniqueUsername(username) {
  const results = await database.query({
    text: `
    SELECT  
      username
    FROM 
      users
    WHERE
      LOWER(username) = LOWER($1)
    ;`,

    values: [username],
  });

  if (results.rowCount > 0) {
    throw new ValidationError({
      message: "O apelido informado já está sendo utilizado.",
      action: "Utilize outro apelido para realizar esta operacao",
    });
  }
}

async function ValidateUniqueEmail(email) {
  const results = await database.query({
    text: `
    SELECT  
      email
    FROM 
      users
    WHERE
      LOWER(email) = LOWER($1)
    ;`,

    values: [email],
  });

  if (results.rowCount > 0) {
    throw new ValidationError({
      message: "O email informado já está sendo utilizado.",
      action: "Utilize outro email para realizar a operacao.",
    });
  }
}

async function update(username, userInputValues) {
  const currentUser = await findOneByUsername(username);

  if ("username" in userInputValues) {
    await ValidateUniqueUsername(userInputValues.username);
  }

  if ("email" in userInputValues) {
    await ValidateUniqueEmail(userInputValues.email);
  }

  if ("password" in userInputValues) {
    await hashPasswordInObject(userInputValues);
  }

  const userWithNewValues = { ...currentUser, ...userInputValues };

  const updatedUser = await runUpdateQuery(userWithNewValues);

  return updatedUser;

  async function runUpdateQuery(userWithNewValues) {
    const results = await database.query({
      text: `
      UPDATE
        users
      SET
        username = $2,
        email = $3,
        password = $4,
        created_at = $5,
        updated_at = timezone('utc', now())
      WHERE
        id = $1
      RETURNING
        *
      `,
      values: [
        userWithNewValues.id,
        userWithNewValues.username,
        userWithNewValues.email,
        userWithNewValues.password,
        userWithNewValues.created_at,
      ],
    });

    return results.rows[0];
  }
}

async function hashPasswordInObject(userInputValues) {
  const hashedPassword = await password.hash(userInputValues.password);
  userInputValues.password = hashedPassword;
}

const user = {
  create,
  findOneByUsername,
  findOneByEmail,
  update,
};

export default user;
