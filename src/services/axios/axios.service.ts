import { Injectable } from '@nestjs/common';
import axios, { AxiosError } from 'axios';

interface CustomError extends AxiosError {
	response: any;
}

@Injectable()
export class AxiosService {
	async req<TData, TReturn>(
		url: string,
		data: TData,
		method?: 'POST' | 'GET',
	): Promise<{ content: string; error: boolean; data?: TReturn }> {
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
		} catch (error) {
			let customError: CustomError;
			if (error && (error as CustomError).response) {
				customError = error as CustomError;
				const { message } = customError.response.data;
				return { content: `Axios GET error: ${message}`, error: true };
			}
			return { content: `Axios GET error: ${error}`, error: true };
		}
	}
}
