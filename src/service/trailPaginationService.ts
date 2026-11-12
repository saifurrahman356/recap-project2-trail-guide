import { Request, Response } from "express";
import type { TrailFiltersResult, PageInformation } from "../types";
import { getTrailFilters } from "./trailFilterService";
import { renderError } from "./errorHandlerService";
import { getAllTrails } from "../models/trailModel";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 4;

export function getPageInformation(req: Request): PageInformation {
  const page = Number(req.query.page) || DEFAULT_PAGE;
  const pageSize = Number(req.query.pagesize) || DEFAULT_PAGE_SIZE;

  return { page, pageSize };
}

export async function showPaginatedTrails(
  req: Request,
  res: Response,
  isAdmin = false,
) {
  try {
    const result = getTrailFilters(req);
    const pageInformation = getPageInformation(req);

    if (!result.success) {
      return renderError(res, 400, "Invalid Filters", result.error);
    }

    const paginatedTrails = await getAllTrails(result.filters, pageInformation);
    const trails = paginatedTrails.items;
    const totalTrails = paginatedTrails.total;
    const totalPages = Math.ceil(totalTrails / pageInformation.pageSize);
    const currentPage = pageInformation.page;

    return res.status(200).render("index.njk", {
      trails,
      q: result.filters.q ?? "",
      currentPage,
      totalPages,
      previousPageUrl:
        currentPage > 1 ? getPageUrl(currentPage - 1, result, isAdmin) : null,
      nextPageUrl:
        currentPage < totalPages
          ? getPageUrl(currentPage + 1, result, isAdmin)
          : null,
      showSearch: true,
      isAdmin,
      totalTrails,
    });
  } catch (error) {
    console.error(error);

    return renderError(
      res,
      500,
      "Failed to Fetch Trails",
      "Sorry, there was an error fetching the trails.",
    );
  }
}

export const getPageUrl = (
  pageNumber: number,
  result: TrailFiltersResult,
  isAdmin = false,
) => {
  const queryParams = new URLSearchParams();

  if (result.success && result.filters.region) {
    queryParams.set("region", result.filters.region);
  }

  if (result.success && result.filters.difficulty) {
    queryParams.set("difficulty", result.filters.difficulty);
  }

  if (result.success && result.filters.q) {
    queryParams.set("q", result.filters.q);
  }

  if (result.success && result.filters.q) {
    queryParams.set("q", result.filters.q);
  }

  const params = new URLSearchParams(queryParams);
  params.set("page", String(pageNumber));

  return isAdmin ? `/admin?${params.toString()}` : `/?${params.toString()}`;
};
