import React from 'react';
import { Progress } from 'semantic-ui-react';

const ProgressBar = ({ uploadState, percentUploaded }) => (
	uploadState && uploadState === 'uploading' && (
		<Progress 
			className="progress-bar"
			percent={percentUploaded}
			indicating
			size="tiny"
			inverted
		/>
	)
);

export default ProgressBar;