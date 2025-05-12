import { useState } from 'react';
import styled from 'styled-components';

const ItemIcon = styled.div`
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
	&:hover {
		filter: blur(.5px);
	}
  font-size: 1.5rem;
`;

export default function ({ iconName }: { iconName: string }) {
	const [hasError, setHasError] = useState(false);

	return (
		<ItemIcon>
			{hasError ? (
				'🛡️'
			) : (
				<img
					src={`/icons/BagItems/${iconName}.png`}
					alt={iconName}
					onError={() => setHasError(true)}
				/>
			)}
		</ItemIcon>
	);
}
