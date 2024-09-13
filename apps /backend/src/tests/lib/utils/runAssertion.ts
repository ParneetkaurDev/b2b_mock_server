export function runAssertion(assertion: () => void, onFailure: () => void) {
	try {
		assertion();
	} catch (exception) {
		onFailure();
		throw exception;
	}
}
