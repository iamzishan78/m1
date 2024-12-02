const { useMutation } = require('@apollo/client');
const { REFETCH_HELPER } = require('graphQL/useMutationRefetchHelper');

const useRefetchHelper = () => {
	const [getRefetchHelper] = useMutation(REFETCH_HELPER);

	return refetchQueries => {
		getRefetchHelper({ variables: {}, refetchQueries, awaitRefetchQueries: true });
	};
};

export default useRefetchHelper;
