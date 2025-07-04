import React, { useState } from 'react';
import {
  faEdit,
  faPlus,
  faSearch,
  faClone,
  faTrash,
  faClockRotateLeft,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useUserContext } from 'contexts/UserContext';
import { format } from 'date-fns';
import Card from 'elements/Card';
import { Button, ToggleSwitch, Dropdown, Tooltip } from 'flowbite-react';
import { Trans, useTranslation } from 'react-i18next';
import { RESPONSE_TAG } from 'utils/entities';
import CitationFormat from './CitationFormat';
import NotifyButton from './NotifyButton';
import RemoveDuplicateModal from 'components/cite/RemoveDuplicateModal';
import OecdLogo from '../ui/OecdLogo';

function Tools({
  incident,
  incidentReports,
  isSubscribed,
  subscribeToNewReports,
  subscribing,
  isLiveData,
  setIsLiveData,
  linkRecords,
}) {
  const [showRemoveDuplicateModal, setShowRemoveDuplicateModal] = useState(false);

  const { t } = useTranslation();

  const { isRole, loading, user } = useUserContext();

  const isUserLoggedIn = user && !loading;

  return (
    <Card>
      <Card.Header>
        <h4 className="m-0">
          <Trans>Tools</Trans>
        </h4>
      </Card.Header>
      <Card.Body className="flex-row flex-wrap gap-2">
        <NotifyButton
          subscribing={subscribing}
          onClick={subscribeToNewReports}
          subscribed={isSubscribed}
          userLoggedIn={isUserLoggedIn}
        />
        <Button
          color="gray"
          href={`/apps/submit?incident_ids=${incident.incident_id}&date_downloaded=${format(
            new Date(),
            'yyyy-MM-dd'
          )}`}
          className="hover:no-underline"
        >
          <FontAwesomeIcon
            icon={faPlus}
            title={t('New Report')}
            className="mr-2"
            titleId="new-report-icon"
          />
          <Trans>New Report</Trans>
        </Button>
        <Button
          color="gray"
          href={`/apps/submit?tags=${RESPONSE_TAG}&incident_ids=${incident.incident_id}`}
          className="hover:no-underline"
        >
          <FontAwesomeIcon
            icon={faPlus}
            title={t('New Response')}
            className="mr-2"
            titleId="new-response-icon"
          />
          <Trans>New Response</Trans>
        </Button>
        <Button
          color="gray"
          href={'/apps/discover?incident_id=' + incident.incident_id}
          className="hover:no-underline"
        >
          <FontAwesomeIcon
            className="mr-2"
            icon={faSearch}
            title={t('Discover')}
            titleId="discover-icon"
          />
          <Trans>Discover</Trans>
        </Button>
        <CitationFormat incidentReports={incidentReports} incident={incident} />
        {!loading && user && isRole('incident_editor') && (
          <>
            <Button
              className="hover:no-underline"
              color="gray"
              href={'/incidents/edit?incident_id=' + incident.incident_id}
            >
              <FontAwesomeIcon
                className="mr-2"
                icon={faEdit}
                title={t('Edit Incident')}
                titleId="edit-incident-icon"
              />
              <Trans>Edit Incident</Trans>
            </Button>
            <Button
              data-cy="remove-duplicate"
              color="gray"
              onClick={() => {
                setShowRemoveDuplicateModal(true);
              }}
            >
              <FontAwesomeIcon
                className="mr-2"
                icon={faTrash}
                title={t('Remove Duplicate')}
                titleId="remove-duplicate-icon"
              />
              <Trans>Remove Duplicate</Trans>
            </Button>
            {showRemoveDuplicateModal && (
              <RemoveDuplicateModal
                incident={incident}
                show={showRemoveDuplicateModal}
                onClose={() => setShowRemoveDuplicateModal(false)}
              />
            )}
          </>
        )}
        {!loading && user && isRole('taxonomy_editor') && (
          <Button
            color="gray"
            href={`/apps/csettool/${incident.incident_id}`}
            className="hover:no-underline"
          >
            <FontAwesomeIcon
              className="mr-2"
              icon={faEdit}
              title={t('CSET Annotators Table')}
              titleId="csettool"
            />
            <Trans>CSET Annotators Table</Trans>
          </Button>
        )}
        {!loading && user && isRole('incident_editor') && (
          <Button
            color="gray"
            href={`/incidents/new?incident_id=${incident.incident_id}`}
            className="hover:no-underline"
            data-cy="clone-incident-btn"
          >
            <FontAwesomeIcon
              className="mr-2"
              icon={faClone}
              title={t('Clone Incident')}
              titleId="clone-incident-icon"
            />
            <Trans>Clone Incident</Trans>
          </Button>
        )}
        <Button
          color="gray"
          href={`/incidents/history?incident_id=${incident.incident_id}`}
          className="hover:no-underline"
          data-cy="view-history-btn"
        >
          <FontAwesomeIcon
            className="mr-2"
            icon={faClockRotateLeft}
            title={t('View History')}
            titleId="view-history-icon"
          />
          <Trans>View History</Trans>
        </Button>
        {!loading && user && (isRole('incident_editor') || isRole('taxonomy_editor')) && (
          <div className="flex items-center">
            <ToggleSwitch
              checked={isLiveData}
              label={t('Show Live data')}
              onChange={(checked) => {
                setIsLiveData(checked);
              }}
              name="live-data-switch"
              data-cy="toogle-live-data"
            />
          </div>
        )}

        {linkRecords && linkRecords.find((link) => link.source_namespace === 'OECD') && (
          <>
            <Button
              color="gray"
              className="hover:no-underline"
              data-testid="oecd-btn"
              as="div"
              target="_blank"
            >
              <Tooltip
                content={
                  <div className="w-60">
                    <Trans>
                      The OECD AI Incidents and Hazards Monitor (AIM) automatically collects and
                      classifies AI-related incidents and hazards in real time from reputable news
                      sources worldwide.
                    </Trans>
                  </div>
                }
                placement="top"
              >
                <FontAwesomeIcon
                  icon={faQuestionCircle}
                  style={{ color: 'rgb(210, 210, 210)', cursor: 'pointer' }}
                  className="far fa-question-circle mr-2"
                  size="lg"
                />
              </Tooltip>

              <Dropdown
                label={
                  <>
                    <OecdLogo width={'20px'} className="mr-2" />
                    <Trans>See in OECD AIM</Trans>
                  </>
                }
                inline={true}
                className="-ml-3"
                placement="bottom"
              >
                {linkRecords
                  .filter((link) => link.source_namespace === 'OECD')
                  .map((link) => (
                    <Dropdown.Item key={link.sameAs} as={'a'} href={link.sameAs} target="_blank">
                      <Trans>Report</Trans> {link.sameAs.split('/').pop()}
                    </Dropdown.Item>
                  ))}
              </Dropdown>
            </Button>
          </>
        )}
      </Card.Body>
    </Card>
  );
}

export default Tools;
