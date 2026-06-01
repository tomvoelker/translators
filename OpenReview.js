{
	"translatorID": "096fe0f3-49df-4e63-b8d7-047705034585",
	"label": "OpenReview",
	"creator": "Tom Voelker",
	"target": "^https://openreview\\.net/(?:forum|pdf)\\?id=[A-Za-z0-9_-]+",
	"minVersion": "5.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsibv",
	"lastUpdated": "2026-06-01 02:14:03"
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
	return getForumURL(url) ? 'conferencePaper' : false;
}

async function doWeb(doc, url) {
	let forumURL = getForumURL(url);
	if (!forumURL) return;

	if (new URL(url).pathname == '/pdf') {
		doc = await requestDocument(forumURL);
	}
	await scrape(doc, forumURL);
}

function getForumURL(url) {
	let id = getOpenReviewID(url);
	if (!id) return false;
	return `https://openreview.net/forum?id=${encodeURIComponent(id)}`;
}

function getOpenReviewID(url) {
	let urlObject;
	try {
		urlObject = new URL(url);
	}
	catch (e) {
		return false;
	}

	if (urlObject.hostname != 'openreview.net') return false;
	if (urlObject.pathname != '/forum' && urlObject.pathname != '/pdf') return false;

	return urlObject.searchParams.get('id') || false;
}

async function scrape(doc, url) {
	let translator = Zotero.loadTranslator('web');
	// Embedded Metadata
	translator.setTranslator('951c027d-74ac-47d4-a107-9c3069ab7b48');
	translator.setDocument(doc);
	translator.setHandler('itemDone', (_obj, item) => {
		item.url = url;
		item.complete();
	});

	let em = await translator.getTranslatorObject();
	em.itemType = 'conferencePaper';
	await em.doWeb(doc, url);
}

/** BEGIN TEST CASES **/
var testCases = [
	{
		"type": "web",
		"url": "https://openreview.net/pdf?id=nzpLWnVAyah",
		"items": [
			{
				"itemType": "conferencePaper",
				"creators": [
					{
						"firstName": "Marius",
						"lastName": "Mosbach",
						"creatorType": "author"
					},
					{
						"firstName": "Maksym",
						"lastName": "Andriushchenko",
						"creatorType": "author"
					},
					{
						"firstName": "Dietrich",
						"lastName": "Klakow",
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
				"title": "On the Stability of Fine-tuning BERT: Misconceptions, Explanations, and Strong Baselines",
				"abstractNote": "Fine-tuning pre-trained transformer-based language models such as BERT has become a common practice dominating leaderboards across various NLP benchmarks. Despite the strong empirical performance of fine-tuned models, fine-tuning is an unstable process: training the same model with multiple random seeds can result in a large variance of the task performance. Previous literature (Devlin et al., 2019; Lee et al., 2020; Dodge et al., 2020) identified two potential reasons for the observed instability: catastrophic forgetting and small size of the fine-tuning datasets. In this paper, we show that both hypotheses fail to explain the fine-tuning instability. We analyze BERT, RoBERTa, and ALBERT, fine-tuned on commonly used datasets from the GLUE benchmark, and show that the observed instability is caused by optimization difficulties that lead to vanishing gradients. Additionally, we show that the remaining variance of the downstream task performance can be attributed to differences in generalization where fine-tuned models with the same training loss exhibit noticeably different test performance. Based on our analysis, we present a simple but strong baseline that makes fine-tuning BERT-based models significantly more stable than the previously proposed approaches. Code to reproduce our results is available online: https://github.com/uds-lsv/bert-stable-fine-tuning.",
				"conferenceName": "International Conference on Learning Representations",
				"date": "2020/10/02",
				"url": "https://openreview.net/forum?id=nzpLWnVAyah",
				"language": "en",
				"libraryCatalog": "openreview.net",
				"shortTitle": "On the Stability of Fine-tuning BERT"
			}
		]
	},
	{
		"type": "web",
		"url": "https://openreview.net/forum?id=nzpLWnVAyah",
		"items": [
			{
				"itemType": "conferencePaper",
				"creators": [
					{
						"firstName": "Marius",
						"lastName": "Mosbach",
						"creatorType": "author"
					},
					{
						"firstName": "Maksym",
						"lastName": "Andriushchenko",
						"creatorType": "author"
					},
					{
						"firstName": "Dietrich",
						"lastName": "Klakow",
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
				"title": "On the Stability of Fine-tuning BERT: Misconceptions, Explanations, and Strong Baselines",
				"abstractNote": "Fine-tuning pre-trained transformer-based language models such as BERT has become a common practice dominating leaderboards across various NLP benchmarks. Despite the strong empirical performance of fine-tuned models, fine-tuning is an unstable process: training the same model with multiple random seeds can result in a large variance of the task performance. Previous literature (Devlin et al., 2019; Lee et al., 2020; Dodge et al., 2020) identified two potential reasons for the observed instability: catastrophic forgetting and small size of the fine-tuning datasets. In this paper, we show that both hypotheses fail to explain the fine-tuning instability. We analyze BERT, RoBERTa, and ALBERT, fine-tuned on commonly used datasets from the GLUE benchmark, and show that the observed instability is caused by optimization difficulties that lead to vanishing gradients. Additionally, we show that the remaining variance of the downstream task performance can be attributed to differences in generalization where fine-tuned models with the same training loss exhibit noticeably different test performance. Based on our analysis, we present a simple but strong baseline that makes fine-tuning BERT-based models significantly more stable than the previously proposed approaches. Code to reproduce our results is available online: https://github.com/uds-lsv/bert-stable-fine-tuning.",
				"conferenceName": "International Conference on Learning Representations",
				"date": "2020/10/02",
				"url": "https://openreview.net/forum?id=nzpLWnVAyah",
				"language": "en",
				"libraryCatalog": "openreview.net",
				"shortTitle": "On the Stability of Fine-tuning BERT"
			}
		]
	}
]
/** END TEST CASES **/
