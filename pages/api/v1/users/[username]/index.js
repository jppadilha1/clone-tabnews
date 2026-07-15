import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/user.js";

const router = createRouter();

router.get(getHandler);
router.patch(patchHandler);

export default router.handler(controller.onErrorHandlers);

async function getHandler(request, response) {
  const username = request.query.username;

  const userfound = await user.findOneByUsername(username);

  return response.status(200).json(userfound);
}

async function patchHandler(request, response) {
  const username = request.query.username;
  const userInputValues = request.body;

  const userUpdated = await user.update(username, userInputValues);

  return response.status(200).json(userUpdated);
}
