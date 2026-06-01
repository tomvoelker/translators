{
	"translatorID": "b97462fa-f20b-4a1e-8a73-3a434a81518b",
	"label": "USENIX",
	"creator": "Tim Leonhard Storm",
	"target": "^https?://(?:www\\.)?usenix\\.org/(?:conference/.*/presentation|legacy/(?:events|publications/library/proceedings)/)",
	"minVersion": "5.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsibv",
	"lastUpdated": "2026-06-01 00:07:09"
}

/*
	***** BEGIN LICENSE BLOCK *****

	Copyright © 2025 Tim Leonhard Storm

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
/* Remove pairs of unescaped braces (note that braces in title are quite unlikely anyway) */

function stripAllUnescapedBraces(s) {
	let prev;
	do {
		prev = s;
		s = s.replace(/(^|[^\\])(\{(.*?)\})/g, (_, before, full, content) => before + content);
	} while (s !== prev);
	// Unescape \{ and \} to { and }
	return s.replace(/\\([{}])/g, '$1');
}

function isLegacyProceedingsPage(url) {
	return url.includes('/legacy/events/')
		|| url.includes('/legacy/publications/library/proceedings/');
}

function getLegacyTitle(doc) {
	return stripAllUnescapedBraces(text(doc, 'h2') || '');
}

function getLegacyAuthorBlock(doc) {
	let heading = doc.querySelector('h2');
	if (!heading) return '';

	let parentText = heading.parentElement.innerText || heading.parentElement.textContent;
	let title = heading.innerText || heading.textContent;
	let start = parentText.indexOf(title);
	if (start == -1) return '';

	let textAfterTitle = parentText.slice(start + title.length);
	return textAfterTitle.split(/\n\s*Abstract\b/i)[0].trim();
}

function lineIsAffiliation(line) {
	if (/^(?:the\s+)?(?:university|hewlett-packard|computer laboratory|laborator|department|school|college|institute|research)\b/i.test(line)) {
		return true;
	}
	return /\b(?:university|laborator(?:y|ies)|institute|college|school|department|research)\b/i.test(line)
		&& !/\band\b/i.test(line)
		&& !line.includes(',');
}

function cleanLegacyAuthorLine(line) {
	return line.replace(/,\s*[^,]*(?:University|Computer Laboratory|Hewlett-Packard|Laborator(?:y|ies)|Institute|College|School|Department|Research)\b.*$/, '');
}

function addLegacyAuthors(item, doc) {
	let authorLines = getLegacyAuthorBlock(doc)
		.split(/\n+/)
		.map(line => ZU.trimInternal(line))
		.filter(line => line && !lineIsAffiliation(line))
		.map(cleanLegacyAuthorLine)
		.filter(Boolean);

	let authors = authorLines.join(', ')
		.replace(/(?:,)?\s+\band\b\s+/g, ', ')
		.split(/\s*,\s*/)
		.filter(Boolean);

	for (let author of authors) {
		item.creators.push(ZU.cleanAuthor(author, 'author'));
	}
}

function scrapeLegacyProceedings(doc, url) {
	let item = new Zotero.Item('conferencePaper');
	item.title = getLegacyTitle(doc);
	item.url = url;
	item.libraryCatalog = 'USENIX';
	item.conferenceName = (doc.title || '').replace(/\s+[–-]\s+Abstract$/, '');

	let year = item.conferenceName.match(/\b(19|20)\d{2}\b/);
	if (year) {
		item.date = year[0];
	}

	for (let paragraph of doc.querySelectorAll('p')) {
		let pages = paragraph.textContent.match(/\bPp\.\s*([\d–-]+)/);
		if (pages) {
			item.pages = pages[1];
			break;
		}
	}

	addLegacyAuthors(item, doc);

	let pdfLink = doc.querySelector('a[href$=".pdf"]');
	if (pdfLink) {
		item.attachments.push({
			title: 'Full Text PDF',
			url: pdfLink.href,
			mimeType: 'application/pdf'
		});
	}

	item.complete();
}


async function scrape(doc) {
	let translator = Zotero.loadTranslator('web');
	// Embedded Metadata
	translator.setTranslator('951c027d-74ac-47d4-a107-9c3069ab7b48');
	translator.setDocument(doc);
	translator.setHandler('itemDone', (_obj, item) => {
		item.title = stripAllUnescapedBraces(item.title);
		item.complete();
	});
	translator.translate();
}

function detectWeb(doc, url) {
	if (url.includes('/presentation/')) {
		return 'conferencePaper';
	}
	if (isLegacyProceedingsPage(url) && getLegacyTitle(doc)) {
		return 'conferencePaper';
	}
	return false;
}

async function doWeb(doc, url) {
	if (isLegacyProceedingsPage(url)) {
		scrapeLegacyProceedings(doc, url);
		return;
	}
	await scrape(await requestDocument(url));
}

/** BEGIN TEST CASES **/
var testCases = [
	{
		"type": "web",
		"url": "https://www.usenix.org/conference/pepr25/presentation/sharma",
		"detectedItemType": "conferencePaper",
		"items": [
			{
				"itemType": "journalArticle",
				"title": "Verifying Humanness: Personhood Credentials for the Digital Identity Crisis",
				"creators": [
					{
						"firstName": "Tanusree",
						"lastName": "Sharma",
						"creatorType": "author"
					}
				],
				"date": "2025",
				"language": "en",
				"libraryCatalog": "www.usenix.org",
				"shortTitle": "Verifying Humanness",
				"url": "https://www.usenix.org/conference/pepr25/presentation/sharma",
				"attachments": [
					{
						"title": "Snapshot",
						"mimeType": "text/html"
					}
				],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "https://www.usenix.org/conference/usenixsecurity18/presentation/bock",
		"items": [
			{
				"itemType": "conferencePaper",
				"title": "Return Of Bleichenbacher’s Oracle Threat (ROBOT)",
				"creators": [
					{
						"firstName": "Hanno",
						"lastName": "Böck",
						"creatorType": "author"
					},
					{
						"firstName": "Juraj",
						"lastName": "Somorovsky",
						"creatorType": "author"
					},
					{
						"firstName": "Craig",
						"lastName": "Young",
						"creatorType": "author"
					}
				],
				"date": "2018",
				"ISBN": "9781939133045",
				"conferenceName": "27th USENIX Security Symposium (USENIX Security 18)",
				"language": "en",
				"libraryCatalog": "www.usenix.org",
				"pages": "817-849",
				"url": "https://www.usenix.org/conference/usenixsecurity18/presentation/bock",
				"attachments": [
					{
						"title": "Full Text PDF",
						"mimeType": "application/pdf"
					}
				],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "https://www.usenix.org/legacy/publications/library/proceedings/sd96/wilkes.html",
		"items": [
			{
				"itemType": "conferencePaper",
				"creators": [
					{
						"firstName": "Stefan",
						"lastName": "Savage",
						"creatorType": "author"
					},
					{
						"firstName": "John",
						"lastName": "Wilkes",
						"creatorType": "author"
					}
				],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [
					{
						"title": "Full Text PDF",
						"mimeType": "application/pdf"
					}
				],
				"title": "AFRAID - A Frequently Redundant Array of Independent Disks",
				"url": "https://www.usenix.org/legacy/publications/library/proceedings/sd96/wilkes.html",
				"libraryCatalog": "USENIX",
				"conferenceName": "USENIX 1996 ANNUAL TECHNICAL CONFERENCE",
				"date": "1996"
			}
		]
	},
	{
		"type": "web",
		"url": "https://www.usenix.org/legacy/events/usenix07/tech/kotla.html",
		"items": [
			{
				"itemType": "conferencePaper",
				"creators": [
					{
						"firstName": "Ramakrishna",
						"lastName": "Kotla",
						"creatorType": "author"
					},
					{
						"firstName": "Lorenzo",
						"lastName": "Alvisi",
						"creatorType": "author"
					},
					{
						"firstName": "Mike",
						"lastName": "Dahlin",
						"creatorType": "author"
					}
				],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [
					{
						"title": "Full Text PDF",
						"mimeType": "application/pdf"
					}
				],
				"title": "SafeStore: A Durable and Practical Storage System",
				"url": "https://www.usenix.org/legacy/events/usenix07/tech/kotla.html",
				"libraryCatalog": "USENIX",
				"conferenceName": "2007 USENIX Annual Technical Conference (USENIX '07)",
				"date": "2007",
				"pages": "129–142",
				"shortTitle": "SafeStore"
			}
		]
	}
]
/** END TEST CASES **/
