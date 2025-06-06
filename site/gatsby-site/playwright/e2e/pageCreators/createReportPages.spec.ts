import sinon from 'sinon';
import createReportPages from '../../../page-creators/createReportPages';
import { CreatePagesArgs } from 'gatsby';
import { expect } from '@playwright/test';
import { getLanguages, test } from '../../utils';
import { isCompleteReport } from '../../../src/utils/variants';

test.describe('createReportPages', () => {
  let graphql: sinon.SinonStub;
  let createPage: sinon.SinonSpy;

  const response = {
    data: {
      reports: {
        nodes: [
          { 
            report_number: 1, 
            language: 'en',
            title: 'Report 1',
            url: 'http://example.com/1',
            source_domain: 'example.com'
          },
          { 
            report_number: 2, 
            language: 'es',
            title: 'Report 2',
            url: 'http://example.com/2',
            source_domain: 'example.com'
          },
          { 
            report_number: 3, 
            language: 'es',
            title: 'Report 3',
            url: 'http://example.com/3',
            source_domain: 'example.com'
          },
          // Incomplete report
          {
            report_number: 4,
            language: 'es',
            title: '',
            url: '',
            source_domain: 'example.com'
          },
        ],
      },
    },
  };

  const languages = getLanguages();

  test.beforeEach(() => {
    graphql = sinon.stub();
    createPage = sinon.spy();
  });

  test.afterEach(() => {
    sinon.restore();
  });

  test('Should create pages for all complete reports', async () => {
    graphql.resolves(response);

    await createReportPages(graphql as unknown as CreatePagesArgs['graphql'], createPage, {
      languages,
    });

    const completeReports = response.data.reports.nodes.filter(isCompleteReport);

    expect(createPage.callCount).toEqual(languages.length * completeReports.length);

    languages.forEach((language, languageIndex) => {
      completeReports.forEach((report, reportIndex) => {
        const callIndex = languageIndex * completeReports.length + reportIndex;
        const page = createPage.getCall(callIndex).args[0];

        const reportPath = language.code === 'en' ? `/reports/${report.report_number}/` : `/${language.code}/reports/${report.report_number}/`;
        expect(page.path).toBe(reportPath);
        expect(page.context.originalPath).toBe(reportPath);
        expect(page.context.locale).toBe(language.code);
        expect(page.context.hrefLang).toBe(language.hrefLang);
        expect(page.context.report_number).toBe(report.report_number);
        expect(page.context.language).toBe(report.language);
      });
    });
  });
});
