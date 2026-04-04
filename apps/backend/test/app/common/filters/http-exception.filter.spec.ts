import "reflect-metadata";
import { HttpException, HttpStatus } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { HttpExceptionFilter } from "@/app/common/filters/http-exception.filter";
import { ConfigService } from "@/app/modules/config";

function makeRequest(
	overrides: Partial<{
		url: string;
		method: string;
		requestId: string;
		headers: Record<string, string>;
		ip: string;
	}> = {}
) {
	return {
		url: "/test",
		method: "GET",
		requestId: "req-123",
		headers: { "user-agent": "jest" },
		ip: "127.0.0.1",
		...overrides
	};
}

function makeReply() {
	const reply = {
		_status: 0,
		_body: null as unknown,
		status(code: number) {
			this._status = code;
			return this;
		},
		send(body: unknown) {
			this._body = body;
			return this;
		}
	};
	return reply;
}

function makeHost(request: ReturnType<typeof makeRequest>, reply: ReturnType<typeof makeReply>) {
	return {
		switchToHttp: () => ({
			getRequest: () => request,
			getResponse: () => reply
		})
	};
}

describe("HttpExceptionFilter", () => {
	let devFilter: HttpExceptionFilter;
	let prodFilter: HttpExceptionFilter;

	beforeEach(async () => {
		const devModule: TestingModule = await Test.createTestingModule({
			providers: [HttpExceptionFilter, { provide: ConfigService, useValue: { get: (_key: string) => "development" } }]
		}).compile();

		const prodModule: TestingModule = await Test.createTestingModule({
			providers: [HttpExceptionFilter, { provide: ConfigService, useValue: { get: (_key: string) => "production" } }]
		}).compile();

		devFilter = devModule.get<HttpExceptionFilter>(HttpExceptionFilter);
		prodFilter = prodModule.get<HttpExceptionFilter>(HttpExceptionFilter);
	});

	describe("catch()", () => {
		it("responds with the HttpException status code", () => {
			const reply = makeReply();
			const exception = new HttpException("Not found", HttpStatus.NOT_FOUND);

			devFilter.catch(exception, makeHost(makeRequest(), reply) as never);

			expect(reply._status).toBe(HttpStatus.NOT_FOUND);
		});

		it("responds with 500 for non-HttpException errors", () => {
			const reply = makeReply();

			devFilter.catch(new Error("crash"), makeHost(makeRequest(), reply) as never);

			expect(reply._status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
		});

		it("response body includes statusCode, path, method and timestamp", () => {
			const reply = makeReply();
			const request = makeRequest({ url: "/ping", method: "POST" });
			const exception = new HttpException("Bad request", HttpStatus.BAD_REQUEST);

			devFilter.catch(exception, makeHost(request, reply) as never);

			const body = reply._body as Record<string, unknown>;
			expect(body.statusCode).toBe(HttpStatus.BAD_REQUEST);
			expect(body.path).toBe("/ping");
			expect(body.method).toBe("POST");
			expect(typeof body.timestamp).toBe("string");
		});

		it("includes requestId in the response body", () => {
			const reply = makeReply();
			const request = makeRequest({ requestId: "abc-xyz" });

			devFilter.catch(new HttpException("err", 400), makeHost(request, reply) as never);

			const body = reply._body as Record<string, unknown>;
			expect(body.requestId).toBe("abc-xyz");
		});

		it("includes error name in non-production when exception is an Error", () => {
			const reply = makeReply();
			const error = new Error("boom");
			error.name = "CustomError";

			devFilter.catch(error, makeHost(makeRequest(), reply) as never);

			const body = reply._body as Record<string, unknown>;
			expect(body.error).toBe("CustomError");
		});

		it("omits error field in production", () => {
			const reply = makeReply();

			prodFilter.catch(new Error("boom"), makeHost(makeRequest(), reply) as never);

			const body = reply._body as Record<string, unknown>;
			expect(body.error).toBeUndefined();
		});

		it("extracts message array from HttpException validation response", () => {
			const reply = makeReply();
			const exception = new HttpException(
				{ message: ["field is required", "field must be string"], error: "Bad Request" },
				HttpStatus.BAD_REQUEST
			);

			devFilter.catch(exception, makeHost(makeRequest(), reply) as never);

			const body = reply._body as Record<string, unknown>;
			expect(Array.isArray(body.message)).toBe(true);
			expect(body.message).toEqual(["field is required", "field must be string"]);
		});

		it("falls back to exception.message for plain HttpException", () => {
			const reply = makeReply();
			const exception = new HttpException("Simple error message", HttpStatus.FORBIDDEN);

			devFilter.catch(exception, makeHost(makeRequest(), reply) as never);

			const body = reply._body as Record<string, unknown>;
			expect(body.message).toBe("Simple error message");
		});
	});
});
