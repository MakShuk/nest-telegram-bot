import { Injectable } from '@nestjs/common';
import axios, { AxiosError } from 'axios';

@Injectable()
export class AxiosService {
	async req<RequestBody, ResponseType>({
		url,
		data,
		method,
	}: {
		url: string;
		data: RequestBody;
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	}): Promise<{ content: string; error: boolean; data?: ResponseType }> {
		try {
			const response = await axios({
				url,
				method,
				data,
			});
			return {
				content: `Data received from the request to ${url}`,
				error: false,
				data: response.data,
			};
		} catch (error: AxiosError | any) {
			if (error.response) {
				return {
					content: `Axios GET error: ${error.response.data}`,
					error: true,
				};
			}
			return { content: `Axios GET error: ${error}`, error: true };
		}
	}
}
