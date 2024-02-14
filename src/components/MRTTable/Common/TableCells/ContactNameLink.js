import Avatar from 'react-avatar';
import { memo } from 'react';
import MonetizationOnIcon from '@material-ui/icons/LocalAtmOutlined';
import ColumnWithLink from 'components/Common/MRTable/ColumnWithLink';
import FeatureFlag from 'components/MRTTable/Common/TableCells/FeatureFlagComponent';
import { FEATURES } from 'components/Shared/FeatureFlag/common';

function ContactNameLink({ contact }) {
  const isPurchased = [true, 'true', 'True'].includes(contact?.isPurchased);
  return (<div
    style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    }}
  >
    {typeof contact?.entityDetail?.name === 'string' && (
      <Avatar
        color={Avatar.getRandomColor(contact?.entityDetail?.name, ['#b5d2f6', '#ade2e9', '#eaeaea', '#f2c1e2', '#d7d6fb'])}
        fgColor="#000"
        name={contact?.entityDetail?.name.split(' ').splice(0, 2).join(' ')}
        size="35"
        round

      />
    )}

    <p
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: '300px',
        marginLeft: '10px',
      }}
    >
      <ColumnWithLink
        value={contact?.entityDetail?.name}
        link={`/contact/details/${contact?._id}`}
        onClick={e => {
          e.stopPropagation();
        }}
      />
      {isPurchased && (
        <FeatureFlag feature={FEATURES.IDICORE}>
          <MonetizationOnIcon
            data-testid="monetization-icon"
            style={{
              marginLeft: '10px',
              color: "gray"
            }}

          />
        </FeatureFlag>
      )}
    </p>
  </div>)
}

export default memo(ContactNameLink);
