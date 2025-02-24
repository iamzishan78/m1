import React, { useEffect, useMemo } from 'react';
import CommonForm from 'components/Shared/FormsFieldsData/CommonForm';
import bulkAddActivityForm from 'components/Shared/FormsFieldsData/RightDialogsSchema/ContactGrid/bulk_add_activity_form_schema';
import { sideDialogController } from 'hookstate/sideDialogController';
import { useForm } from 'react-hook-form';
import { isEqual, merge } from 'lodash';

function transformActivity(activity) {
	return {
		type: activity.activityType.value,
		name: activity.activityName,
		notes: activity.notes,
		ownerId: activity.activityOwner.value,
		ownerName: activity.activityOwner.displayName,
		dateTime: formatToGMT(activity.startTime.date, activity.startTime.time),
		endDateTime: formatToGMT(activity.endTime.date, activity.endTime.time),
		isClosed: activity.activityStatus.value,
	};
}

function formatToGMT(date, time) {
	const dateTimeString = `${date}T${time}:00`;
	const dateObj = new Date(dateTimeString);
	return dateObj.toUTCString();
}

const BulkAddActivityForm = ({ fieldKey, setFieldKey }) => {
	const Controller = sideDialogController('activityDialog');
	const formState = Controller.useCompleteState();
	const formStateValues = formState?.get({ noproxy: true });

	const { control, reset, getValues, setValue, watch } = useForm();

	const formValues = watch();

	const formSchema = useMemo(() => {
		return bulkAddActivityForm({
			getValues,
			setValue,
		});
	}, [formState?.rerenderJson]);

	useEffect(() => {
		const values = merge(
			Object.entries(formValues).reduce((acc, [key, value]) => {
				if (value == null) {
					return acc;
				}

				acc[key] = value;

				return acc;
			}, {}),
			Object.entries(formStateValues).reduce((acc, [key, value]) => {
				if (value == null) {
					return acc;
				}

				acc[key] = value;

				return acc;
			}, {})
		);

		if (!values.activityName || !values.activityType || !values.activityStatus || !values.activityOwner) {
			setFieldKey(false);
			return;
		}

		const parseDateTime = ({ date, time }) => new Date(`${date}T${time}:00Z`);

		const startDateTime = parseDateTime(values.startTime);
		const endDateTime = parseDateTime(values.endTime);

		if (endDateTime < startDateTime) {
			setFieldKey(false);
			return;
		}

		const updatedValue = transformActivity(values);

		if (!isEqual(fieldKey, updatedValue)) setFieldKey(updatedValue);
	}, [fieldKey, formValues, formState]);

	return (
		<CommonForm formSchema={formSchema} control={control} reset={reset} watch={watch} dialogKey={'activityDialog'} />
	);
};

export default BulkAddActivityForm;
