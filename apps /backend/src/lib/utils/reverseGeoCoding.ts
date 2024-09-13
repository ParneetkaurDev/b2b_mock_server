import axios from "axios";

export const reverseGeoCodingCheck = async (
	lat: string,
	long: string,
	area_code: string
) => {
	try {
		const res = await axios.get(
			`https://apis.mappls.com/advancedmaps/v1/${process.env.MAPPLS_API_KEY}/rev_geocode?lat=${lat}&lng=${long}`
		);
		const response = res.data;
		return response.results[0].pincode === area_code;
	} catch (error) {
		console.log(error);
	}
};
