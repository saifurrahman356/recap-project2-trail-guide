import { getTrailBySlug, getTrailById } from "../models/trailModel";
import { slugify } from "../utils/utils";
import { sanitize } from "./sanitizeContentService";
import { getTrimmedString } from "../utils/utils";
import {
  TrailUpdateBodyRequest,
  PrepareUpdateTrailResult,
  UpdateTrail,
} from "../types";
import {
  PrepareNewTrailResult,
  type CreateTrail,
  type TrailBodyRequest,
} from "../types";
import { isValidCreateTrail, isValidUpdateTrail } from "../utils/typeGuards";
import { getRegionById } from "../models/regionModel";

export async function prepareNewTrail(
  body: TrailBodyRequest,
): Promise<PrepareNewTrailResult> {
  if (!body) {
    return {
      success: false,
      statusCode: 400,
      errorMessage: "Request body is missing.",
    };
  }
  const input = {
    title: getTrimmedString(body.title),
    regionId: Number(body.regionId),
    difficulty: getTrimmedString(body.difficulty),
    distanceKm: Number(body.distanceKm),
    description: getTrimmedString(body.description),
    imageUrl: getTrimmedString(body.imageUrl),
    tagIds: Array.isArray(body.tagIds)
      ? body.tagIds.map(Number)
      : body.tagIds
        ? [Number(body.tagIds)]
        : [],
  };

  if (!isValidCreateTrail(input)) {
    return {
      success: false,
      statusCode: 400,
      errorMessage: "Invalid input. Please fill in all required fields.",
    };
  }

  const region = await getRegionById(Number(input.regionId));
  if (!region) {
    return {
      success: false,
      statusCode: 400,
      errorMessage: `Region with ID: ${input.regionId} not found.`,
    };
  }

  const slug = slugify(input.title);

  if (!slug) {
    return {
      success: false,
      statusCode: 400,
      errorMessage: "Invalid input. Please fill in all required fields.",
    };
  }

  const existingTrail = await getTrailBySlug(slug);

  if (existingTrail) {
    return {
      success: false,
      statusCode: 400,
      errorMessage: `A trail with the slug "${slug}" already exists.`,
    };
  }

  const newTrail: CreateTrail = {
    title: input.title,
    regionId: Number(input.regionId),
    difficulty: input.difficulty,
    distanceKm: Number(input.distanceKm),
    description: input.description ? sanitize(input.description) : "",
    imageUrl: input.imageUrl,
    tagIds: input.tagIds.filter((tagId) => tagId != 0),
    createdAt: Math.floor(Date.now() / 1000),
    slug,
  };

  return {
    success: true,
    statusCode: 200,
    errorMessage: "",
    trail: newTrail,
  };
}

export async function prepareUpdateTrail(
  trailId: number,
  body: TrailUpdateBodyRequest,
): Promise<PrepareUpdateTrailResult> {
  if (!body) {
    return {
      success: false,
      statusCode: 400,
      errorMessage: "Request body is missing.",
    };
  }

  if (!Number.isInteger(trailId) || trailId <= 0) {
    return {
      success: false,
      statusCode: 400,
      errorMessage: `Invalid trail ID: ${trailId}`,
    };
  }

  const existingTrail = await getTrailById(trailId);

  if (!existingTrail) {
    return {
      success: false,
      statusCode: 404,
      errorMessage: "Trail not found.",
    };
  }

  const input = {
    title: body.title === undefined ? undefined : getTrimmedString(body.title),
    regionId: body.regionId === undefined ? undefined : Number(body.regionId),
    difficulty:
      body.difficulty === undefined
        ? undefined
        : getTrimmedString(body.difficulty),
    distanceKm:
      body.distanceKm === undefined ? undefined : Number(body.distanceKm),
    description:
      body.description === undefined
        ? undefined
        : getTrimmedString(body.description),
    imageUrl:
      body.imageUrl === undefined ? undefined : getTrimmedString(body.imageUrl),
    tagIds:
      body.tagIds === undefined
        ? undefined
        : Array.isArray(body.tagIds)
          ? body.tagIds.filter(Boolean).map(Number)
          : body.tagIds
            ? [Number(body.tagIds)]
            : [],
  };

  if (!isValidUpdateTrail(input)) {
    return {
      success: false,
      statusCode: 400,
      errorMessage: "Invalid trail update input.",
    };
  }

  const updatedTrail: UpdateTrail = {};

  if (input.regionId !== undefined) {
    const region = await getRegionById(Number(input.regionId));

    if (!region) {
      return {
        success: false,
        statusCode: 400,
        errorMessage: `Region with ID: ${input.regionId} not found.`,
      };
    }

    updatedTrail.regionId = Number(input.regionId);
  }

  if (input.title !== undefined) {
    const slug = slugify(input.title);

    if (!slug) {
      return {
        success: false,
        statusCode: 400,
        errorMessage: "Invalid trail title.",
      };
    }

    if (slug !== existingTrail.slug) {
      const trailWithSlug = await getTrailBySlug(slug);

      if (trailWithSlug) {
        return {
          success: false,
          statusCode: 409,
          errorMessage: `A trail with the slug "${slug}" already exists.`,
        };
      }
    }

    updatedTrail.title = input.title;
    updatedTrail.slug = slug;
  }

  if (input.difficulty !== undefined) {
    updatedTrail.difficulty = input.difficulty;
  }

  if (input.distanceKm !== undefined) {
    updatedTrail.distanceKm = Number(input.distanceKm);
  }

  if (input.description !== undefined) {
    updatedTrail.description = sanitize(input.description);
  }

  if (input.imageUrl !== undefined) {
    updatedTrail.imageUrl = input.imageUrl;
  }

  if (input.tagIds !== undefined) {
    updatedTrail.tagIds = input.tagIds;
  }

  return {
    success: true,
    statusCode: 200,
    errorMessage: "",
    trail: updatedTrail,
  };
}
