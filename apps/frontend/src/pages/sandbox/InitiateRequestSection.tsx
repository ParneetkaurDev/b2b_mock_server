/* eslint-disable no-mixed-spaces-and-tabs */
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { checker, INITIATE_FIELDS } from "../../utils";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { Input, Option, Select, Button } from "@mui/joy";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Divider from "@mui/material/Divider";
import Grow from "@mui/material/Grow";
import { useMessage } from "../../utils/hooks";
import HelpOutlineTwoToneIcon from "@mui/icons-material/HelpOutlineTwoTone";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

// type InitiateRequestSectionProp = {
// 	domain: "b2b" | "services" | "agri-services" | "healthcare-services";
// };

type SELECT_OPTIONS =
	| string[]
	| { b2b: string[]; services: string[]; agri_services: string[] }
	| { b2b: string[]; services: string[]; agri_services: string[] }
	| { services: string[] }
	| { agri_services: string[] }
	| { healthcare_services: string[] }
	| object;

type SELECT_FIELD = {
	name: string;
	placeholder: string;
	type: string;
	domainDepended: boolean;
	options: SELECT_OPTIONS;
};

export const InitiateRequestSection = () => {
	const { handleMessageToggle, setMessageType, setCopy } = useMessage();
	const [action, setAction] = useState<string>();
	const [domain, setDomain] = useState<string | object>("b2b");
	const [renderActionFields, setRenderActionFields] = useState(false);
	const [formState, setFormState] = useState<object>();
	const [allowSubmission, setAllowSubmission] = useState<boolean>();

	const handleActionSelection = (
		_event: React.SyntheticEvent | null,
		newValue: string | null
	) => {
		setRenderActionFields(false);
		setAction(newValue as string);
		setFormState({});
		setAllowSubmission(false);
		setTimeout(() => setRenderActionFields(true), 500);
	};

	const handleFieldChange = (fieldName: string, value: string | object) => {
		if (fieldName === "service_name") {
			setDomain(value);
		}
		setFormState((prev) => ({ ...prev, [fieldName]: value }));
	};

	useEffect(() => {
		if (action) {
			const keys = Object.keys(formState || {});
			const formKeys = INITIATE_FIELDS[
				action as keyof typeof INITIATE_FIELDS
			].map((e) => e.name);
			const scenarios = INITIATE_FIELDS[
				action as keyof typeof INITIATE_FIELDS
			].filter((e) => e.name === "scenario")[0];

			if (checker(keys, formKeys)) setAllowSubmission(true);
			else if (
				checker(
					keys,
					formKeys.filter((e) => e !== "scenario")
				) &&
				scenarios?.domainDepended &&
				!scenarios.options[domain as keyof SELECT_OPTIONS]
			)
				setAllowSubmission(true);
			else setAllowSubmission(false);
		}
	}, [action, domain, formState]);

	const handleSubmit = async () => {
		try {
			const response = await axios.post(
				`${
					import.meta.env.VITE_SERVER_URL
				}/${domain}/initiate/${action}?mode=mock`,
				formState,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			if (response.data.message.ack.status === "ACK") {
				if (action === "search") {
					handleMessageToggle(
						`Your Transaction ID is: ${response.data.transaction_id}`
					);
					setMessageType("success");
					setCopy(response.data.transaction_id);
				} else {
					handleMessageToggle("Request Initiated Successfully!`");
					setMessageType("success");
				}
			} else if (response.data.error) {
				handleMessageToggle(
					`Error Occurred: ${
						response.data.error.message || response.data.error
					}`
				);
				setMessageType("error");
			}
		} catch (error: any) {
			setMessageType("error");
			if (
				error instanceof AxiosError &&
				error.response?.data?.error?.message.error?.message
			)
				handleMessageToggle(
					error.response?.data?.error?.message.error?.message === "string"
						? error.response?.data?.error?.message.error?.message
						: "Error Occurred while initiating request!"
				);
			else handleMessageToggle("Error Occurred while initiating request!");
		}
	};

	return (
		<Fade in={true} timeout={2500}>
			<Paper
				sx={{
					width: "100%",
					// height: "100%",
					p: 1,
					px: 2,
					// overflow: "hidden",
				}}
			>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<Typography variant="h6" my={1} mr={2}>
						Initiate Request:
					</Typography>
					<Tooltip title="Are you a seller app, Initiate Requests here 👇">
						<IconButton>
							<HelpOutlineTwoToneIcon />
						</IconButton>
					</Tooltip>
				</Box>

				<Stack spacing={2} sx={{ my: 2 }}>
					<Select placeholder="Select Action" onChange={handleActionSelection}>
						{Object.keys(INITIATE_FIELDS).map((action, idx) => (
							<Option value={action} key={"action-" + idx}>
								{action}
							</Option>
						))}
					</Select>

					<Grow in={renderActionFields} timeout={500}>
						<Stack spacing={2} sx={{ my: 2 }}>
							<Divider />
							{action &&
								INITIATE_FIELDS[action as keyof typeof INITIATE_FIELDS].map(
									(field, index) => (
										<>
											{field.type === "text" ? (
												<Input
													fullWidth
													placeholder={field.placeholder}
													key={"input-" + action + "-" + index}
													onChange={(e) =>
														handleFieldChange(field.name, e.target.value)
													}
												/>
											) : field.type === "select" &&
											  (field as SELECT_FIELD).domainDepended &&
											  (field as SELECT_FIELD).options[
													domain as keyof SELECT_OPTIONS
											  ] ? (
												<Select
													placeholder={field.placeholder}
													key={"select-" + action + "-" + index}
													onChange={(
														_event: React.SyntheticEvent | null,
														newValue: string | null
													) =>
														handleFieldChange(field.name, newValue as string)
													}
												>
													{(
														(field as SELECT_FIELD).options[
															domain as keyof SELECT_OPTIONS
														] as string[]
													).map((option, index: number) => (
														<Option value={option} key={option + index}>
															{option}
														</Option>
													))}
												</Select>
											) : field.type === "select" && !field.domainDepended ? (
												<Select
													placeholder={field.placeholder}
													key={"select-" + action + "-" + index}
													onChange={(
														_event: React.SyntheticEvent | null,
														newValue: string | null
													) =>
														handleFieldChange(field.name, newValue as string)
													}
												>
													{(field.options as string[]).map(
														(option, index: number) => (
															<Option value={option} key={option + index}>
																{option}
															</Option>
														)
													)}
												</Select>
											) : (
												<></>
											)}
										</>
									)
								)}
						</Stack>
					</Grow>
				</Stack>
				<Box sx={{ display: "flex", justifyContent: "center" }}>
					<Button
						variant="solid"
						onClick={handleSubmit}
						disabled={!allowSubmission}
					>
						Send
					</Button>
				</Box>
			</Paper>
		</Fade>
	);
};
