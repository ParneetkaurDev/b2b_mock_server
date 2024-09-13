import swaggerUi from "swagger-ui-express";
import { NextFunction, Request, Response } from "express";
import swaggerAuthSpec from "openapi-specs/auth.json";
import swaggerMiscSpec from "openapi-specs/misc.json";
import swaggerRetailB2BSpec from "openapi-specs/retail-b2b.json";
import swaggerRetailB2CSpec from "openapi-specs/b2c.json";
import swaggerServicesSpec from "openapi-specs/services.json";
import swaggerAgriServicesSpec from "openapi-specs/agri-services.json";
import swaggerHealthcareServicesSpec from "openapi-specs/agri-services.json";

export const authSwagger =
	(url: string) => (req: Request, res: Response, next: NextFunction) => {
		if (!req.originalUrl.includes(url)) return next();
		swaggerUi.setup(swaggerAuthSpec)(req, res, next);
	};

export const miscSwagger =
	(url: string) => (req: Request, res: Response, next: NextFunction) => {
		if (!req.originalUrl.includes(url)) return next();
		swaggerUi.setup(swaggerMiscSpec)(req, res, next);
	};

export const servicesSwagger =
	(url: string) => (req: Request, res: Response, next: NextFunction) => {
		if (!req.originalUrl.includes(url)) return next();
		swaggerUi.setup(swaggerServicesSpec)(req, res, next);
	};

export const b2bSwagger =
	(url: string) => (req: Request, res: Response, next: NextFunction) => {
		if (!req.originalUrl.includes(url)) return next();
		swaggerUi.setup(swaggerRetailB2BSpec)(req, res, next);
	};

export const b2cSwagger =
	(url: string) => (req: Request, res: Response, next: NextFunction) => {
		if (!req.originalUrl.includes(url)) return next();
		swaggerUi.setup(swaggerRetailB2CSpec)(req, res, next);
	};

export const agriServiceSwagger =
	(url: string) => (req: Request, res: Response, next: NextFunction) => {
		if (!req.originalUrl.includes(url)) return next();
		swaggerUi.setup(swaggerAgriServicesSpec)(req, res, next);
	};

export const healthcareServiceSwagger =
	(url: string) => (req: Request, res: Response, next: NextFunction) => {
		if (!req.originalUrl.includes(url)) return next();
		swaggerUi.setup(swaggerHealthcareServicesSpec)(req, res, next);
	};
