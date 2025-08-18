import database from "infra/database.js";
import { ValidationError } from "infra/errors.js";

async function create(userInputValues) {
  await ValidateUniqueEmail(userInputValues.email);
  await ValidateUniqueUsername(userInputValues.username);

  const newUser = await runInsertQuey(userInputValues);
  return newUser;

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
        action: "Utilize outro email para realizar o cadastro.",
      });
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
        action: "Utilize outro apelido para realizar o cadastro.",
      });
    }
  }

  async function runInsertQuey(userInputValues) {
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

const user = {
  create,
};

export default user;
