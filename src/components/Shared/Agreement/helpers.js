import { get } from "lodash";

export const getCustomMetaFields = (agreementDetails, metaDataRes) => {
    const metaData = get(metaDataRes, "getMetaData.metaData", []);
    const customData = [];
    const attachedMetaData = [];
    const nonAttachedMetaData = [];

    if (agreementDetails?.custom_data) {
        Object.keys(agreementDetails?.custom_data).forEach((key) => {
            if (agreementDetails?.custom_data_arr) {
                const meta = agreementDetails.custom_data_arr.find((m) => m.key === key);
                if (meta) {
                    customData.push({ ...meta, title: meta.key, label: meta.key, key: meta.key, value: meta.value });
                }
            }
        });
    }

    //? Meta data which is attached to this agreement
    metaData.forEach(md => {
        const { isCustom, ...meta } = md;
        if (md.name in get(agreementDetails, "custom_data", [])) {
            attachedMetaData.push(meta);
        } else {
            nonAttachedMetaData.push(meta);
        }
    });

    attachedMetaData.forEach(meta => {
        customData.push({
            ...meta,
            title: meta.label,
            key: `custom_data.${meta.name}`,
            options: meta.dropdownOptions.map((op) => ({
                ...op,
                label: op.value,
            })),
            isCustomData: true
        });
    });

    nonAttachedMetaData.forEach(meta => {
        customData.push({
            ...meta,
            title: meta.label,
            key: `custom_data.${meta.name}`,
            options: meta.dropdownOptions.map((op) => ({
                ...op,
                label: op.value,
            })),
            isCustomData: true
        });
    });
    return customData;
}