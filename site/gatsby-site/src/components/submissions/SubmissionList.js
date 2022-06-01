import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { Spinner } from 'react-bootstrap';
import Link from 'components/ui/Link';
import SubmissionReview from 'components/submissions/SubmissionReview';
import { FIND_SUBMISSIONS } from '../../graphql/submissions';
import { useQuery } from '@apollo/client';

const SubmissionList = () => {
  const { data, loading } = useQuery(FIND_SUBMISSIONS);

  return (
    <>
      <p className="paragraph">
        The following incident reports have been <Link to="/apps/submit">submitted </Link> by users
        and are pending review by editors. Only editors may promote these records to incident
        reports in the database.
      </p>
      <ListGroup className="mb-5" data-cy="submissions">
        {loading && (
          <>
            <Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true" />{' '}
            <p>Loading Submissions...</p>
          </>
        )}
        {data?.submissions
          .map((submission) => ({ ...submission, __typename: undefined }))
          .sort(
            (a, b) => new Date(a.date_submitted).getTime() - new Date(b.date_submitted).getTime()
          )
          .map((submission) => (
            <ListGroup.Item key={submission._id} className="m-0 p-0">
              <SubmissionReview submission={submission} />
            </ListGroup.Item>
          ))}
      </ListGroup>
    </>
  );
};

export default SubmissionList;