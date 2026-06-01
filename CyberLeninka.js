{
	"translatorID": "ee5e80f3-9919-4842-80f9-3221d6524b99",
	"label": "CyberLeninka",
	"creator": "Tom Voelker",
	"target": "^https?://cyberleninka\\.ru/article/n/",
	"minVersion": "5.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsibv",
	"lastUpdated": "2026-06-01 12:25:31"
}

/*
	***** BEGIN LICENSE BLOCK *****

	Copyright © 2026 Tom Voelker

	This file is part of Zotero.

	Zotero is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	Zotero is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public License
	along with Zotero. If not, see <http://www.gnu.org/licenses/>.

	***** END LICENSE BLOCK *****
*/

function detectWeb(doc, url) {
	if (!isArticleURL(url)) {
		return false;
	}
	return attr(doc, 'meta[name="citation_title"]', 'content') ? 'journalArticle' : false;
}

function isArticleURL(url) {
	try {
		let parsedURL = new URL(url);
		return parsedURL.hostname == 'cyberleninka.ru'
			&& /^\/article\/n\/[^/]+\/?$/.test(parsedURL.pathname);
	}
	catch (e) {
		return false;
	}
}

async function doWeb(doc, url) {
	let translator = Zotero.loadTranslator('web');
	// Embedded Metadata
	translator.setTranslator('951c027d-74ac-47d4-a107-9c3069ab7b48');
	translator.setDocument(doc);
	translator.setHandler('itemDone', (_obj, item) => {
		let creators = getCyberLeninkaAuthors(doc);
		if (creators) {
			item.creators = creators;
		}
		item.complete();
	});

	let em = await translator.getTranslatorObject();
	em.itemType = 'journalArticle';
	await em.doWeb(doc, url);
}

function getCyberLeninkaAuthors(doc) {
	let creators = [];
	let hasSurnameInitials = false;
	for (let meta of doc.querySelectorAll('meta[name="citation_author"]')) {
		let author = parseCyberLeninkaAuthor(meta.content);
		if (!author) continue;
		creators.push(author.creator);
		hasSurnameInitials = hasSurnameInitials || author.hasSurnameInitials;
	}
	return creators.length && hasSurnameInitials ? creators : false;
}

function parseCyberLeninkaAuthor(author) {
	let name = ZU.trimInternal(author);
	if (!name) return false;

	let matches = name.match(/^([А-ЯЁа-яёІЇЄҐієїґ'’.-]+)\s+((?:[А-ЯЁІЇЄҐ]\.\s*){1,4})$/u);
	if (!matches) {
		return {
			creator: ZU.cleanAuthor(name, 'author'),
			hasSurnameInitials: false
		};
	}

	return {
		creator: {
			firstName: normalizeInitials(matches[2]),
			lastName: matches[1],
			creatorType: 'author'
		},
		hasSurnameInitials: true
	};
}

function normalizeInitials(initials) {
	return ZU.trimInternal(initials.replace(/\.\s*(?=[А-ЯЁІЇЄҐ]\.)/g, '. '));
}

/** BEGIN TEST CASES **/
var testCases = [
	{
		"type": "web",
		"url": "https://cyberleninka.ru/article/n/analiz-dannyh-slozhnyh-obektov-s-pomoschyu-modifitsirovannogo-algoritma-klasterizatsii",
		"items": [
			{
				"itemType": "journalArticle",
				"creators": [
					{
						"firstName": "Т. Б.",
						"lastName": "Шатовская",
						"creatorType": "author"
					},
					{
						"firstName": "О. О.",
						"lastName": "Дорожко",
						"creatorType": "author"
					}
				],
				"notes": [],
				"tags": [
					{
						"tag": "CLUSTERING"
					},
					{
						"tag": "GRAPH"
					},
					{
						"tag": "HIERARCHY"
					},
					{
						"tag": "MODIFICATION"
					},
					{
						"tag": "MODIFIED CLUSTERING METHOD(THE CHAMELEON ALGORITHM)"
					},
					{
						"tag": "ГРАФ"
					},
					{
						"tag": "ИЕРАРХИЯ"
					},
					{
						"tag": "КЛАСТЕРИЗАЦИЯ"
					},
					{
						"tag": "МОДИФИКАЦИЯ"
					},
					{
						"tag": "МОДИФИЦИРОВАННЫЙ МЕТОД КЛАСТЕРИЗАЦИИ (АЛГОРИТМ ХАМЕЛЕОН)"
					}
				],
				"seeAlso": [],
				"attachments": [
					{
						"title": "Full Text PDF",
						"mimeType": "application/pdf"
					}
				],
				"title": "Анализ данных сложных объектов с помощью модифицированного алгоритма кластеризации",
				"publicationTitle": "Восточно-Европейский журнал передовых технологий",
				"volume": "2",
				"issue": "4 (68)",
				"pages": "55-59",
				"date": "2014",
				"ISSN": "1729-3774",
				"url": "https://cyberleninka.ru/article/n/analiz-dannyh-slozhnyh-obektov-s-pomoschyu-modifitsirovannogo-algoritma-klasterizatsii",
				"abstractNote": "At the present moment, the development of universal and reliable methods and approaches suitable for processing information from various fields, including the solution of problems that may arise in the medical field, is an urgent problem. In the treatment of complex diseases of the musculoskeletal system, whose etiology is not fully disclosed and requires additional investigation, is no exception. As a result of the analysis, it was concluded that for solving such kind of problems with ambiguous, variable data it makes sense to use a modified clustering algorithm.The algorithm allows to apply specific, the most suitable method for current data at each stage of the study. The study of the final stage of the algorithm integration of similar classes for obtaining the final partition.The idea of considering a complex object − the musculoskeletal system appeared as the result of analyzing specific articles of the complex object.As a result of the studies it was concluded that the modified clustering method with integrating similar classes for obtaining the final partition makes sense to use in experiments with a complex object − the musculoskeletal system. Experimental data will be presented with the development of the problem under consideration.",
				"libraryCatalog": "cyberleninka.ru"
			}
		]
	}
]
/** END TEST CASES **/
