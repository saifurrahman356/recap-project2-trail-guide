import { Response } from "express";

export function renderError(
  res: Response,
  statusCode: number,
  errorTitle: string,
  errorMessage: string,
  action = "/admin",
  actionText = "Back to all trails",
  template = "error/error.njk",
) {
  return res.status(statusCode).render(template, {
    errorTitle,
    errorMessage,
    action,
    actionText,
  });
}
