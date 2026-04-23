import { ZodError } from 'zod';

const firstIssueMessage = (err) => {
  if (err instanceof ZodError && err.issues.length > 0) {
    return err.issues[0].message;
  }
  return 'Invalid input';
};

const validate = (schema, getSource, assign) => (req, res, next) => {
  try {
    const raw = getSource(req);
    assign(req, schema.parse(raw));
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: firstIssueMessage(err) });
    }
    next(err);
  }
};

export const validateBody = (schema) =>
  validate(
    schema,
    (req) => req.body ?? {},
    (req, parsed) => {
      req.body = parsed;
    }
  );

export const validateQuery = (schema) =>
  validate(
    schema,
    (req) => req.query ?? {},
    (req, parsed) => {
      req.query = parsed;
    }
  );

export const validateParams = (schema) =>
  validate(
    schema,
    (req) => req.params ?? {},
    (req, parsed) => {
      req.params = parsed;
    }
  );
