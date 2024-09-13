import * as fs from "fs";
import { reverseGeoCodingCheck } from "../../../utils/reverseGeoCoding";

const fileContents: string = fs.readFileSync("pinToStd.json", "utf-8");
const pinToStd: Record<string, string> = JSON.parse(fileContents);

export const checkFulfillmentLocation = async (log: any): Promise<boolean> => {
	// let srchObj: Record<string, string> = {};
	const endLocation = log?.message?.intent?.fulfillment?.stops.filter(
		(stop: { type: string; location: string }) => stop.type === "end"
	)[0].location;
	try {
		const [lat, long] = endLocation.gps.split(",");
		const area_code = endLocation.area_code;
		const match = await reverseGeoCodingCheck(lat, long, area_code);
		if (!match)
			// srchObj[
			//   "RGC-end-Err"
			// ] = `Reverse Geocoding for \`end\` failed. Area Code ${area_code} not matching with ${lat},${long} Lat-Long pair.`;
			return false;
	} catch (error) {
		console.log("Error in end location", error);
		return false;
	}

	try {
		const stdCode = log.context?.location?.city?.code.split(":")[1];
		const area_code = endLocation?.area_code;
		if (pinToStd[area_code] && pinToStd[area_code] != stdCode) {
			// srchObj[
			//   "CityCode-Err"
			// ] = `CityCode ${stdCode} should match the city for the fulfillment end location ${area_code}, ${pinToStd[area_code]}`;
			return false;
		}
	} catch (err) {
		console.error("Error in city code check: ", (err as Error).message);
		return false;
	}
	return true;
};

export const isEndTimeGreater = (data: any): boolean => {
	const startTime = parseInt(data.start);
	const endTime = parseInt(data.end);
	return startTime < endTime;
};
