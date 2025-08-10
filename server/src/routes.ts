import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { Map, newAssocMap } from "./assoc";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

/** Contains the saved contents (of unknown type) for each file name */
let saved: Map<unknown> = newAssocMap();

/** Empty the map of saves, for testing purposes */
export const resetSavesForTesting = (): void => {
  saved = newAssocMap();
};

/** Add a save to the map of saves, for testing purposes */
export const addSaveForTesting = (key: string, value: unknown): void => {
  saved = saved.setValue(key, value);
};

/**
 * Returns a greeting message if "name" is provided in query params
 * @param req request to respond to
 * @param res object to send response with
 */
export const dummy = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.query.name);
  if (name === undefined) {
    res.status(400).send('missing "name" parameter');
    return;
  }

  res.send({ greeting: `Hi, ${name}` });
};


/** Returns a list of all the named save files. */
export const getNames = (_req: SafeRequest, _res: SafeResponse): void => {
  // TODO: Implement getNames route function
};


/** Updates the last save for the give name to the post value. */
export const save = (_req: SafeRequest, _res: SafeResponse): void => {
  // TODO: Implement save route function
};


/** Returns the last save value or null if none. */
export const load = (_req: SafeRequest, _res: SafeResponse): void => {
  // TODO: Implement load route function
};


// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string | undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};
