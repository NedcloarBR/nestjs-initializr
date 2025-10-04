export interface NPMResponse {
	objects: Package[];
	total: number;
	time: Date;
}

export interface Package {
	downloads: Downloads;
	dependents: string;
	updated: Date;
	searchScore: number;
	package: Package;
	score: Score;
	flags: Flags;
}

export interface Downloads {
	monthly: number;
	weekly: number;
}

export interface Flags {
	insecure: number;
}

export interface Package {
	name: string;
	keywords: string[];
	version: string;
	description: string;
	sanitized_name: string;
	publisher: Publisher;
	maintainers: Publisher[];
	date: Date;
	links: Links;
}

export interface Links {
	repository: string;
	bugs: string;
	npm: string;
}

export interface Publisher {
	email: string;
	username: string;
}

export interface Score {
	final: number;
	detail: Detail;
}

export interface Detail {
	popularity: number;
	quality: number;
	maintenance: number;
}
