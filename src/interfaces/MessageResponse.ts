export default interface MessageResponse {
	message: string;
	listings?: Listing[];
}

interface Listing {
	price: string;
	address: string;
}
