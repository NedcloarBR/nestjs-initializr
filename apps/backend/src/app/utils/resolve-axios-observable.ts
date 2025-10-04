import { AxiosResolveError } from "@/app/common/errors/axios.error";
import { Logger } from "@nestjs/common";
import { AxiosError, type AxiosResponse } from "axios";
import { type Observable, catchError, firstValueFrom, throwError } from "rxjs";

export async function resolveAxiosObservable<T>(source: Observable<AxiosResponse<T>>): Promise<AxiosResponse<T>> {
	const logger = new Logger("ResolveAxiosObservable");

	return firstValueFrom(
		source.pipe(
			catchError((error: unknown) => {
				if (error instanceof AxiosError) {
					logger.error(
						`Axios request failed: ${error.message}`,
						JSON.stringify({
							url: error.config?.url,
							method: error.config?.method,
							status: error.response?.status,
							data: error.response?.data
						})
					);

					return throwError(() => new AxiosResolveError(error.message || "Error executing Axios request"));
				}

				logger.error("Unexpected error while consuming Observable", error as Error);
				return throwError(() => new AxiosResolveError("Unexpected error while resolving Observable"));
			})
		)
	);
}
