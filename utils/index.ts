import { decode, encode } from "base-64";
import { DocumentPickerAsset } from "expo-document-picker";
import * as fs from "expo-file-system";

export function base64ToBytes(base64: string): Uint8Array {
	const binaryString = decode(base64);
	const len = binaryString.length;
	const bytes = new Uint8Array(len);
	for (let i = 0; i < len; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}
	return bytes;
}
export function mergeChunks(chunks: string[]): Uint8Array {
	const byteArrays = chunks.map(base64ToBytes);
	const totalLength = byteArrays.reduce((sum, arr) => sum + arr.length, 0);
	const merged = new Uint8Array(totalLength);

	let offset = 0;
	for (const arr of byteArrays) {
		merged.set(arr, offset);
		offset += arr.length;
	}

	return merged;
}
export function bytesToBase64(bytes: Uint8Array): string {
	let binary = "";
	for (let i = 0; i < bytes.length; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return encode(binary);
}
export const sleep = async (time: number) =>
	new Promise((res) => setTimeout(res, time));

export function objectToFormData(obj: object): FormData {
	const formData = new FormData();

	function appendToFormData(
		value: any,
		key: string,
		formData: FormData,
		namespace = "",
	): void {
		const formKey = namespace ? `${namespace}[${key}]` : key;

		if (value === null || value === undefined) {
			// Skip null/undefined values
			return;
		} else if (value instanceof Date) {
			// Handle Date objects
			formData.append(formKey, value.toISOString());
		} else if (value instanceof File || value instanceof Blob) {
			// Handle File/Blob objects
			formData.append(formKey, value);
		} else if (Array.isArray(value)) {
			// Handle arrays
			value.forEach((item, index) => {
				if (
					typeof item === "object" &&
					!(item instanceof File) &&
					!(item instanceof Blob) &&
					item !== null
				) {
					// Recursively handle object items in array
					for (const nestedKey in item) {
						if (item.hasOwnProperty(nestedKey)) {
							appendToFormData(
								item[nestedKey],
								nestedKey,
								formData,
								`${formKey}[${index}]`,
							);
						}
					}
				} else {
					formData.append(`${formKey}[${index}]`, item);
				}
			});
		} else if (typeof value === "object") {
			// Handle nested objects (recursively)
			for (const nestedKey in value) {
				if (value.hasOwnProperty(nestedKey)) {
					appendToFormData(value[nestedKey], nestedKey, formData, formKey);
				}
			}
		} else {
			// Handle primitive values (string, number, boolean)
			formData.append(formKey, String(value));
		}
	}

	// Process the main object
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			const value = obj[key as keyof typeof obj];
			appendToFormData(value, key, formData);
		}
	}

	return formData;
}

export const uploadFileInChunksOptimized = async (
	file: DocumentPickerAsset,
	sendDataFunction: (
		chunkIndex: number,
		data: string,
		isLast: boolean,
	) => Promise<void>,
	onProgress?: (percentage: number) => void,
	maxRetries = 3,
	maxParallel = 3,
) => {
	const CHUNK_SIZE = 512 * 1024; // 512KB
	const totalSize = file.size ?? 0;
	const totalChunks = Math.ceil(totalSize / CHUNK_SIZE);

	const tasks: (() => Promise<void>)[] = [];

	for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
		const position = chunkIndex * CHUNK_SIZE;
		const length = Math.min(CHUNK_SIZE, totalSize - position);
		const isLast = chunkIndex === totalChunks - 1;

		tasks.push(async () => {
			let retries = 0;
			while (retries <= maxRetries) {
				try {
					const chunkBase64 = await fs.readAsStringAsync(file.uri, {
						encoding: fs.EncodingType.Base64,
						length,
						position,
					});

					await sendDataFunction(chunkIndex, chunkBase64, isLast);
					onProgress?.((chunkIndex + 1) / totalChunks);
					return;
				} catch (error) {
					console.warn(`Chunk ${chunkIndex} failed (retry ${retries}):`, error);
					retries++;
					await sleep(200);
				}
			}
			throw new Error(`Chunk ${chunkIndex} failed after ${maxRetries} retries`);
		});
	}

	// Gửi song song theo nhóm
	for (let i = 0; i < tasks.length; i += maxParallel) {
		const batch = tasks.slice(i, i + maxParallel);
		await Promise.all(batch.map((task) => task()));
	}
};
