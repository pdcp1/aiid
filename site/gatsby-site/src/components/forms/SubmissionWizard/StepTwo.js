import { Button, Select } from 'flowbite-react';
import { Formik, Form, useFormikContext } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import * as yup from 'yup';
import Label from '../Label';
import supportedLanguages from '../../i18n/languages.json';
import { getCloudinaryPublicID } from 'utils/cloudinary';
import StepContainer from './StepContainer';
import TagsInputGroup from '../TagsInputGroup';
import PreviewImageInputGroup from 'components/forms/PreviewImageInputGroup';
import FieldContainer from './FieldContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMedal,
  faImage,
  faLanguage,
  faTag,
  faStickyNote,
} from '@fortawesome/free-solid-svg-icons';
import { useUserContext } from 'contexts/UserContext';
import { debounce } from 'debounce';
import SubmissionButton from './SubmissionButton';
import TextInputGroup from '../TextInputGroup';

const StepTwo = (props) => {
  const [data, setData] = useState(props.data);

  // Schema for yup
  const stepTwoValidationSchema = yup.object().shape({
    submitters: yup
      .string()
      .matches(/^.{3,}$/, {
        excludeEmptyString: true,
        message: '*Submitter must have at least 3 characters',
      })
      .matches(/^.{3,200}$/, {
        excludeEmptyString: true,
        message: "*Submitter list can't be longer than 200 characters",
      }),
    image_url: yup
      .string()
      .matches(
        /((https?):\/\/)(\S)*$/,
        '*Must enter URL in http://www.example.com/images/preview.png format'
      ),
    editor_notes: yup.string(),
  });

  const handleSubmit = (values, last) => {
    props.next(values, last);
  };

  useEffect(() => {
    setData({ ...props.data });
  }, [props.data]);

  return (
    <StepContainer name={props.name} childClassName="p-6">
      <Formik
        initialValues={data}
        onSubmit={() => {}}
        validationSchema={stepTwoValidationSchema}
        enableReinitialize
      >
        <FormDetails
          data={data}
          previous={props.previous}
          schema={stepTwoValidationSchema}
          submitForm={handleSubmit}
          validateAndSubmitForm={props.validateAndSubmitForm}
          submissionFailed={props.submissionFailed}
          setSavingInLocalStorage={props.setSavingInLocalStorage}
          submissionComplete={props.submissionComplete}
          submissionReset={props.submissionReset}
        />
      </Formik>
    </StepContainer>
  );
};

const FormDetails = ({
  data,
  previous,
  schema,
  submitForm,
  validateAndSubmitForm,
  submissionFailed,
  submissionComplete,
  submissionReset,
  setSavingInLocalStorage,
}) => {
  const { t } = useTranslation(['submit']);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitCount, setSubmitCount] = useState(0);

  const { user } = useUserContext();

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    isValid,
    validateForm,
    resetForm,
  } = useFormikContext();

  useEffect(() => {
    Object.keys(errors).map((key) => {
      setFieldTouched(key, true);
    });
  }, [data, errors]);

  useEffect(() => {
    setFieldValue('cloudinary_id', values.image_url ? getCloudinaryPublicID(values.image_url) : '');
  }, [values.image_url]);

  useEffect(() => {
    if (submissionFailed || submissionComplete || submissionReset.reset) {
      setIsSubmitting(false);
      setSubmitCount(0);
    }

    if (submissionComplete || submissionReset.reset) {
      resetForm();
    }
  }, [submissionFailed, submissionComplete, submissionReset]);

  const saveInLocalStorage = useRef(
    debounce((values) => {
      localStorage.setItem('formValues', JSON.stringify(values));
      setSavingInLocalStorage(false);
    }, 1000)
  ).current;

  useEffect(() => {
    // Save form values to local storage when form values change
    setSavingInLocalStorage(true);
    saveInLocalStorage(values);
  }, [values]);

  const isUserDetailsComplete = user && user.first_name && user.last_name;

  return (
    <>
      <Form>
        <FieldContainer>
          <TagsInputGroup
            name="submitters"
            popoverName={isUserDetailsComplete ? 'submittersLoggedIn' : 'submitters'}
            placeholder={t("Enter your name for the leaderboard or leave blank for 'Anonymous'.")}
            label={t('Submitter(s)')}
            errors={errors}
            touched={touched}
            schema={schema}
            icon={faMedal}
            disabled={isUserDetailsComplete}
          />
        </FieldContainer>

        <FieldContainer>
          <PreviewImageInputGroup
            cloudinary_id={values.cloudinary_id}
            name="image_url"
            label={t('Image Address')}
            placeholder={t('Image URL')}
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            schema={schema}
            icon={faImage}
          />
        </FieldContainer>

        <FieldContainer>
          <div className="flex items-center mb-1">
            <FontAwesomeIcon fixedWidth icon={faLanguage} title={t('Language')} className="mr-1" />
            <Label popover="language" label={t('Language')} />
          </div>
          <Select
            name="language"
            placeholder={t('Report Language')}
            value={values.language}
            onChange={handleChange}
          >
            {supportedLanguages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.name}
              </option>
            ))}
          </Select>
        </FieldContainer>

        <FieldContainer>
          <TagsInputGroup
            name="tags"
            label={t('Tags')}
            icon={faTag}
            placeholder={t('Tags')}
            schema={schema}
            handleChange={handleChange}
            handleBlur={handleBlur}
            touched={touched}
            values={values}
            errors={errors}
          />
        </FieldContainer>

        <FieldContainer>
          <TextInputGroup
            name="editor_notes"
            label={t('Editor Notes')}
            icon={faStickyNote}
            type="textarea"
            placeholder={t('Optional context and notes about the incident')}
            rows={8}
            schema={schema}
            handleChange={handleChange}
            handleBlur={handleBlur}
            touched={touched}
            values={values}
            errors={errors}
          />
        </FieldContainer>

        <div
          className={`flex ${
            data.is_incident_report && data.incident_ids.length == 0
              ? 'flex-col'
              : 'justify-between'
          } mt-8`}
        >
          <div className="flex justify-between">
            <Button type="button" color={'light'} onClick={() => previous(values)}>
              <svg
                aria-hidden="true"
                className="mr-2 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <Trans>Previous</Trans>
            </Button>

            {data.is_incident_report && data.incident_ids.length == 0 && (
              <Button
                data-cy="to-step-3"
                color={'light'}
                disabled={isSubmitting}
                onClick={() => {
                  setSubmitCount(submitCount + 1);
                  validateAndSubmitForm(
                    false,
                    setIsSubmitting,
                    isValid,
                    validateForm,
                    setFieldTouched,
                    values,
                    submitForm
                  );
                }}
              >
                <span className="lg:hidden">
                  <Trans>More</Trans>
                </span>
                <span className="hidden lg:inline">
                  <Trans>Add more info</Trans>
                </span>
                <svg
                  aria-hidden="true"
                  className="ml-2 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </Button>
            )}
          </div>

          <div
            className={`flex ${
              data.is_incident_report && data.incident_ids.length == 0
                ? 'justify-end mt-4'
                : 'justify-between'
            }`}
          >
            <SubmissionButton
              data-cy="submit-step-2"
              disabled={isSubmitting}
              onClick={() => {
                setSubmitCount(submitCount + 1);
                validateAndSubmitForm(
                  true,
                  setIsSubmitting,
                  isValid,
                  validateForm,
                  setFieldTouched,
                  values,
                  submitForm
                );
              }}
            />
          </div>
        </div>
      </Form>

      {!isValid && submitCount > 0 && (
        <div className="text-danger">
          <Trans ns="validation">Please review. Some data is missing.</Trans>
        </div>
      )}
    </>
  );
};

export default StepTwo;
