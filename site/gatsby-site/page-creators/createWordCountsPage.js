const path = require('path');

const stopword = require('stopword');

const stemmer = require('stemmer');

const customStopWords = require('../constants/customStopWords');

const PAGES_WITH_WORDCOUNT = [
  {
    path: '/summaries/wordcounts',
    componentPath: './src/templates/wordcounts.js',
  },
  {
    path: '/',
    componentPath: './src/templates/landingPage.js',
  },
];

const createWordCountsPage = async (graphql, createPage) => {
  const result = await graphql(`
    query WordCounts {
      allMongodbAiidprodReports {
        nodes {
          text
        }
      }
      latestReport: allMongodbAiidprodReports(
        filter: { is_incident_report: { eq: true } }
        sort: { epoch_date_submitted: DESC }
        limit: 1
      ) {
        nodes {
          report_number
        }
      }
    }
  `);

  // Create wordcounts page
  const wordCounts = {};

  result.data.allMongodbAiidprodReports.nodes.forEach((element) => {
    if (element['text']) {
      const words = stopword.removeStopwords(element['text'].split(' '), customStopWords);

      for (let i = 0; i < words.length; i++) {
        let word = stemmer(words[i].toLowerCase().replace(/\W/g, ''));

        if (word in wordCounts) {
          wordCounts[word] += 1;
        } else {
          wordCounts[word] = 1;
        }
      }
    }
  });

  const wordCountsSorted = [];

  for (let word in wordCounts) {
    if (wordCounts[word] > 99 && word.length > 2) wordCountsSorted.push([word, wordCounts[word]]);
  }

  wordCountsSorted.sort(function (a, b) {
    return b[1] - a[1];
  });

  let numWordClouds = 1;

  let wordsPerCloud = 1;

  const maxNumWordClouds = 8;

  const maxWordsPerCloud = 80;

  // silly way to find a proper value for numWordClouds and wordsPerCloud
  // in scenarios with small amounts of data
  while (numWordClouds * wordsPerCloud < wordCountsSorted.length) {
    if (wordsPerCloud < maxWordsPerCloud) {
      wordsPerCloud++;
    } else if (numWordClouds < maxNumWordClouds) {
      if (wordsPerCloud * (numWordClouds + 1) > wordCountsSorted.length) break;
      numWordClouds++;
    } else {
      break;
    }
  }

  let wordClouds = [];

  for (let i = 0; i < numWordClouds; i++) {
    wordClouds.push([]);
    for (var j = i * wordsPerCloud; j < (i + 1) * wordsPerCloud; j++) {
      wordClouds[i].push({ text: wordCountsSorted[j][0], value: wordCountsSorted[j][1] });
    }
  }

  PAGES_WITH_WORDCOUNT.forEach((page) => {
    createPage({
      path: page.path,
      component: path.resolve(page.componentPath),
      context: {
        wordClouds,
        wordCountsSorted,
        wordsPerCloud,
        latestReportNumber: result.data.latestReport.nodes[0].report_number,
      },
    });
  });
};

module.exports = createWordCountsPage;
