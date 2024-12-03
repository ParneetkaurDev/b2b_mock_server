import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";
import YAML from "yaml";
import {
	responseBuilder,
	AGRI_EXAMPLES_PATH,
	logger,
	AGRI_OUTPUT_EXAMPLES_PATH,
} from "../../../lib/utils";
import { ON_ACTION_KEY } from "../../../lib/utils/actionOnActionKeys";
import { SERVICES_DOMAINS } from "../../../lib/utils/apiConstants";

export const searchController = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const domain = req?.body?.context?.domain;
		logger.info(`domian ${domain}`)
		const {scenario}=req.query
		logger.info(`scenario is ${scenario}`)
		let onSearch, file;
		const {
			message: { intent },
		} = req.body;
		const id = intent?.category?.id;

		switch (domain) {
			case SERVICES_DOMAINS.AGRI_INPUT:
				file = fs.readFileSync(
					path.join(
						AGRI_EXAMPLES_PATH,
						`on_search/${"on_search.yaml"}`
					)
				);
				break;
			case SERVICES_DOMAINS.AGRI_OUTPUT:
				file = fs.readFileSync(
					path.join(
						AGRI_OUTPUT_EXAMPLES_PATH,
						`on_search/${"on_search.yaml"}`
					)
				);
				break;
			default:
				file = fs.readFileSync(
					path.join(AGRI_EXAMPLES_PATH, "on_search/on_search.yaml")
				);
				break;
		}
		const response = YAML.parse(file.toString());
		logger.info
		switch(scenario){
			case "incremental-pull":
				response.value.message = {
					catalog: {
						"bpp/providers":[
							{
								id: response.value.message.catalog['bpp/providers'][0].id,
								time: response.value.message.catalog['bpp/providers'][0].time,
								items: response.value.message.catalog['bpp/providers'][0].items
							}]
					}
				}
				break;
			case "negotiation":
				response.value.message ={
					catalog:{
						...response.value.message.catalog,
						providers:[{
							...response.value.message.catalog.providers[0],
							items:[{
								...response.value.message.catalog.providers[0].items[0],
								tags:[
									{
										descriptor: {
											code: "QUALITY_ASSESSMENT_REPORT"
										},
										display: true,
										list: [
											{
												descriptor: {
													code: "NAME"
												},
												value: "CER-001"
											},
											{
												descriptor: {
													code: "MIME_TYPE"
												},
												value: "application/pdf"
											},
											{
												descriptor: {
													code: "COPY"
												},
												value: "https://abc.com/certificates"
											}
										]
									},
									{
										descriptor: {
											code: "COMMODITY_SPECIFICATION"
										},
										list: [
											{
												descriptor: {
													code: "REFERENCE_DOCS_MIME_TYPE"
												},
												value: "application/pdf"
											},
											{
												descriptor: {
													code: "REFERENCE_DOCS_COPY"
												},
												value: "https://abc.com/commodity_specification.pdf"
											},
											{
												descriptor: {
													code: "SHELF_LIFE"
												},
												value: "P10M"
											},
											{
												descriptor: {
													code: "MOISTURE"
												},
												value: "10%"
											},
											{
												descriptor: {
													code: "FOREIGN_MATTER"
												},
												value: "3%"
											},
											{
												descriptor: {
													code: "OIL_CONTENT"
												},
												value: "2%"
											},
											{
												descriptor: {
													code: "DEFECTIVES"
												},
												value: "7%"
											},
											{
												descriptor: {
													code: "OTHER_EDIBLE_GRAINS"
												},
												value: "1%"
											},
											{
												descriptor: {
													code: "URIC_ACID"
												},
												value: "101"
											},
											{
												descriptor: {
													code: "AFLATOXIN"
												},
												value: "15"
											},
											{
												descriptor: {
													code: "ARGEMONE_SEEDS"
												},
												value: "Yes"
											},
											{
												descriptor: {
													code: "SIZE_RANGE_MEASURE"
												},
												value: "Diameter"
											},
											{
												descriptor: {
													code: "SIZE_RANGE"
												},
												value: "15-18"
											},
											{
												descriptor: {
													code: "PERCENTAGE_OF_DEFECTS"
												},
												value: "1.5%"
											},
											{
												descriptor: {
													code: "PERCENTAGE_OF_WASTAGE"
												},
												value: "3%"
											},
											{
												descriptor: {
													code: "BUNCH_SIZE_VALUE"
												},
												value: "50"
											},
											{
												descriptor: {
													code: "BUNCH_SIZE_UNIT"
												},
												value: "gm"
											},
											{
												descriptor: {
													code: "VISIBLE_COLOUR"
												},
												value: "Brown"
											},
											{
												descriptor: {
													code: "COLOUR_PERCENTAGE"
												},
												value: ">=70%"
											},
											{
												descriptor: {
													code: "TOTAL_SOLUBLE_SOLIDS"
												},
												value: "16 degree Brix"
											},
											{
												descriptor: {
													code: "TRACES_OF_SOIL"
												},
												value: "Sight traces"
											},
											{
												descriptor: {
													code: "VOLATILE_OIL"
												},
												value: "<=2.5%"
											},
											{
												descriptor: {
													code: "TOTAL_ASH"
												},
												value: "<=7%"
											},
											{
												descriptor: {
													code: "CORIANDER_SPLIT_SEEDS_PERCENTAGE"
												},
												value: "5%"
											},
											{
												descriptor: {
													code: "MIN_FLOWER_PER_STEM"
												},
												value: "1"
											},
											{
												descriptor: {
													code: "GIRTH_AT_THIN_END_VALUE"
												},
												value: "<=6"
											},
											{
												descriptor: {
													code: "GIRTH_AT_THIN_END_UNIT"
												},
												value: "cm"
											},
											{
												descriptor: {
													code: "BLOOMING_AND_SHAPE"
												},
												value: ">=85%"
											},
											{
												descriptor: {
													code: "FLOWER_DIAMETER_VALUE"
												},
												value: "3.45"
											},
											{
												descriptor: {
													code: "FLOWER_DIAMETER_UNIT"
												},
												value: "cm"
											},
											{
												descriptor: {
													code: "STAPLE_LENGTH_OF_COTTON_VALUE"
												},
												value: "28‑30"
											},
											{
												descriptor: {
													code: "STAPLE_LENGTH_OF_COTTON_UNIT"
												},
												value: "mm"
											},
											{
												descriptor: {
													code: "TRASH_PERCENTAGE"
												},
												value: "3%"
											},
											{
												descriptor: {
													code: "BUNDLE_STRENGTH"
												},
												value: ">=24.0"
											},
											{
												descriptor: {
													code: "MICRONAIRE"
												},
												value: "2.8-3.0"
											},
											{
												descriptor: {
													code: "PERCENTAGE_OF_MATURED_FIBERS"
												},
												value: ">=70.0"
											},
											{
												descriptor: {
													code: "SIEVE_ANALYSIS"
												},
												value: "98"
											},
											{
												descriptor: {
													code: "NUMBER_OF_NUTS_VALUE"
												},
												value: "210"
											},
											{
												descriptor: {
													code: "NUMBER_OF_NUTS_UNIT"
												},
												value: "kg"
											},
											{
												descriptor: {
													code: "VOID_NUTS"
												},
												value: "1%"
											},
											{
												descriptor: {
													code: "IMMATURE_NUTS"
												},
												value: "2%"
											},
											{
												descriptor: {
													code: "STRENGTH"
												},
												value: "Excellent"
											},
											{
												descriptor: {
													code: "FINENESS"
												},
												value: "10"
											}
										]
									},
									{
										descriptor: {
											code: "NEGOTIATION_SPECIFICATION"
										},
										list: [
											{
												descriptor: {
													code: "items.price.value"
												}
											},
											{
												descriptor: {
													code: "items.quantity.available.count"
												}
											},
											{
												descriptor: {
													code: "items.tags.commodity_specification.moisture"
												}
											},
											{
												descriptor: {
													code: "items.tags.commodity_specification.foreign_matter"
												}
											},
											{
												descriptor: {
													code: "items.tags.commodity_specification.defectives"
												}
											},
											{
												descriptor: {
													code: "items.tags.commodity_specification.other_edible_grains"
												}
											},
											{
												descriptor: {
													code: "items.tags.commodity_specification.size_range"
												}
											},
											{
												descriptor: {
													code: "items.tags.commodity_specification.percentage_of_defects"
												}
											},
											{
												descriptor: {
													code: "items.tags.commodity_specification.percentage_of_wastage"
												}
											},
											{
												descriptor: {
													code: "items.tags.commodity_specification.colour_percentage"
												}
											},
											{
												descriptor: {
													code: "items.tags.commodity_specification.traces_of_soil"
												}
											},
											{
												descriptor: {
													code: "items.tags.commodity_specification.total_ash"
												}
											},
											{
												descriptor: {
													code: "items.tags.commodity_specification.coriander_split_seeds_percentage"
												}
											},
											{
												descriptor: {
													code: "items.tags.commodity_specification.min_flower_per_stem"
												}
											},
											{
												descriptor: {
													code: "items.tags.commodity_specification.girth_at_thin_end"
												}
											},
											{
												descriptor: {
													code: "items.tags.commodity_specification.trash_percentage"
												}
											},
											{
												descriptor: {
													code: "items.tags.commodity_specification.bundle_strength"
												}
											},
											{
												descriptor: {
													code: "items.tags.commodity_specification.micronaire"
												}
											},
											{
												descriptor: {
													code: "items.tags.commodity_specification.percentage_of_matured_fibers"
												}
											},
											{
												descriptor: {
													code: "items.tags.commodity_specification.sieve_analysis"
												}
											},
											{
												descriptor: {
													code: "items.tags.commodity_specification.number_of_nuts"
												}
											},
											{
												descriptor: {
													code: "items.tags.commodity_specification.void_nuts"
												}
											},
											{
												descriptor: {
													code: "items.tags.commodity_specification.immature_nuts"
												}
											},
											{
												descriptor: {
													code: "items.tags.commodity_specification.fineness"
												},
												value: "10"
											}
										]
									}
								]
							}]
						}]
					}
				}
				delete response.value.message.catalog.providers[0].items[0].time
			default:
				response.value.message=response.value.message
		}
		

		 console.log("on_Searchhhh",`${scenario}`,JSON.stringify(response.value.message))
		return responseBuilder(
			res,
			next,
			req.body.context,
			response.value.message,
			`${req.body.context.bap_uri}${req.body.context.bap_uri.endsWith("/") ? "on_search" : "/on_search"
			}`,
			`${ON_ACTION_KEY.ON_SEARCH}`,
			"agri"
		);
	} catch (error) {
		return next(error);
	}
};
