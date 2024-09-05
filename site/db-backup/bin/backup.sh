#!/bin/bash -e

echo "--------------------------------------"
echo "Starting backup.sh script execution..."
echo "--------------------------------------"

# settings
BACKUPFILE_PREFIX="backup"
CLOUDFLARE_R2_ACCOUNT_ID=${CLOUDFLARE_R2_ACCOUNT_ID}
MONGODB_DBNAME="aiidprod"
MONGODB_DBNAME_TRANSLATIONS="translations"

# start script
CWD=$(/usr/bin/dirname $0)
cd $CWD

. ./functions.sh
NOW=$(create_current_yyyymmddhhmmss)

echo "=== $0 started at $(/bin/date "+%Y/%m/%d %H:%M:%S") ==="

TMPDIR="/tmp"
TARGET_DIRNAME="mongodump_full_snapshot"
TARGET="${TMPDIR}/${TARGET_DIRNAME}"
TAR_CMD="/bin/tar"
TAR_OPTS="jcvf"

DIRNAME=$(/usr/bin/dirname ${TARGET})
BASENAME=$(/usr/bin/basename ${TARGET})
TARBALL="${BACKUPFILE_PREFIX}-${NOW}.tar.bz2"
TARBALL_FULLPATH="${TMPDIR}/${TARBALL}"

# check parameters
# deprecate the old option
if [ "x${CLOUDFLARE_R2_ACCOUNT_ID}" == "x" ]; then
  echo "ERROR: CLOUDFLARE_R2_ACCOUNT_ID must be specified." 1>&2
  exit 1
fi
if [ -z "${CLOUDFLARE_R2_WRITE_ACCESS_KEY_ID}" ]; then
  echo "ERROR: If CLOUDFLARE_R2_ACCOUNT_ID environment variable is defined, you have to define the CLOUDFLARE_R2_WRITE_ACCESS_KEY_ID as well" 1>&2
  exit 1
fi
if [ -z "${CLOUDFLARE_R2_WRITE_SECRET_ACCESS_KEY}" ]; then
  echo "ERROR: If CLOUDFLARE_R2_ACCOUNT_ID environment variable is defined, you have to define the CLOUDFLARE_R2_WRITE_SECRET_ACCESS_KEY as well" 1>&2
  exit 1
fi
if [ -z "${CLOUDFLARE_R2_BUCKET_NAME}" ]; then
  echo "ERROR: If CLOUDFLARE_R2_ACCOUNT_ID environment variable is defined, you have to define the CLOUDFLARE_R2_BUCKET_NAME as well" 1>&2
  exit 1
fi

echo "Dump MongoDB 'aiidprod' database..."
mongodump -o ${TARGET} --uri=${MONGODB_URI}/${MONGODB_DBNAME}

echo "Dump MongoDB 'translations' database..."
mongodump -o ${TARGET} --uri=${MONGODB_URI}/${MONGODB_DBNAME_TRANSLATIONS}

echo "Export collections as CSV files..."
mongoexport -o ${TARGET}/incidents.csv --uri=${MONGODB_URI}/${MONGODB_DBNAME} -v --type=csv --collection=incidents --fields=_id,incident_id,date,reports,Alleged\ deployer\ of\ AI\ system,Alleged\ developer\ of\ AI\ system,Alleged\ harmed\ or\ nearly\ harmed\ parties,description,title
mongoexport -o ${TARGET}/duplicates.csv --uri=${MONGODB_URI}/${MONGODB_DBNAME} -v --type=csv --collection=duplicates --fields=duplicate_incident_number,true_incident_number
mongoexport -o ${TARGET}/quickadd.csv --uri=${MONGODB_URI}/${MONGODB_DBNAME} -v --type=csv --collection=quickadd --fields=incident_id,url,date_submitted,source_domain
mongoexport -o ${TARGET}/submissions.csv --uri=${MONGODB_URI}/${MONGODB_DBNAME} -v --type=csv --collection=submissions --fields=authors,date_downloaded,date_modified,date_published,date_submitted,image_url,incident_date,incident_id,language,mongodb_id,source_domain,submitters,text,title,url
mongoexport -o ${TARGET}/reports.csv --uri=${MONGODB_URI}/${MONGODB_DBNAME} -v --type=csv --collection=reports --fields=_id,incident_id,authors,date_downloaded,date_modified,date_published,date_submitted,description,epoch_date_downloaded,epoch_date_modified,epoch_date_published,epoch_date_submitted,image_url,language,ref_number,report_number,source_domain,submitters,text,title,url,tags

# Taxa CSV Export

# Get the field names
mongoexport -o classifications_cset_headers.csv --uri=${MONGODB_URI}/${MONGODB_DBNAME} -v --type=csv --query='{ "namespace": {"$regex": "^CSET" }}' --collection=classifications --noHeaderLine --fields='attributes.0.short_name,attributes.1.short_name,attributes.2.short_name,attributes.3.short_name,attributes.4.short_name,attributes.5.short_name,attributes.6.short_name,attributes.7.short_name,attributes.8.short_name,attributes.9.short_name,attributes.10.short_name,attributes.11.short_name,attributes.12.short_name,attributes.13.short_name,attributes.14.short_name,attributes.15.short_name,attributes.16.short_name,attributes.17.short_name,attributes.18.short_name,attributes.19.short_name,attributes.20.short_name,attributes.21.short_name,attributes.22.short_name,attributes.23.short_name,attributes.24.short_name,attributes.25.short_name,attributes.26.short_name,attributes.27.short_name,attributes.28.short_name,attributes.29.short_name,attributes.30.short_name,attributes.31.short_name'

# Get the values
mongoexport -o classifications_cset_values.csv --uri=${MONGODB_URI}/${MONGODB_DBNAME} -v --type=csv --query='{ "namespace": {"$regex": "^CSET" }}' --collection=classifications --noHeaderLine --fields='_id,incident_id,namespace,publish,attributes.0.value_json,attributes.1.value_json,attributes.2.value_json,attributes.3.value_json,attributes.4.value_json,attributes.5.value_json,attributes.6.value_json,attributes.7.value_json,attributes.8.value_json,attributes.9.value_json,attributes.10.value_json,attributes.11.value_json,attributes.12.value_json,attributes.13.value_json,attributes.14.value_json,attributes.15.value_json,attributes.16.value_json,attributes.17.value_json,attributes.18.value_json,attributes.19.value_json,attributes.20.value_json,attributes.21.value_json,attributes.22.value_json,attributes.23.value_json,attributes.24.value_json,attributes.25.value_json,attributes.26.value_json,attributes.27.value_json,attributes.28.value_json,attributes.29.value_json,attributes.30.value_json,attributes.31.value_json'

# Construct the header
echo -n "_id,incident_id,namespace,publish," >tmp.csv
head -n 1 classifications_cset_headers.csv >tmp_header.csv
cat tmp.csv tmp_header.csv >header.csv

# Concat the header and the values to the output
cat header.csv classifications_cset_values.csv >${TARGET}/classifications_cset.csv

# Cleanup
rm tmp.csv
rm tmp_header.csv
rm header.csv
rm classifications_cset_headers.csv
rm classifications_cset_values.csv

echo "Report contents are subject to their own intellectual property rights. Unless otherwise noted, the database is shared under (CC BY-SA 4.0). See: https://creativecommons.org/licenses/by-sa/4.0/" >${TARGET}/license.txt

# run tar command
echo "Start backup ${TARGET} into ${CLOUDFLARE_R2_BUCKET_NAME} ..."
time ${TAR_CMD} ${TAR_OPTS} ${TARBALL_FULLPATH} -C ${DIRNAME} ${BASENAME}

# upload tarball to Cloudflare R2
r2_copy_file ${CLOUDFLARE_R2_ACCOUNT_ID} ${CLOUDFLARE_R2_WRITE_ACCESS_KEY_ID} ${CLOUDFLARE_R2_WRITE_SECRET_ACCESS_KEY} ${CLOUDFLARE_R2_BUCKET_NAME} ${TARBALL_FULLPATH} ${TARBALL}

# call healthchecks url for successful backup
if [ "x${HEALTHCHECKS_URL}" != "x" ]; then
  curl -fsS --retry 3 ${HEALTHCHECKS_URL} >/dev/null
fi