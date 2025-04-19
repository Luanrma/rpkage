'use client';

import ItemGeneratorContainer from '@/app/components/ItemGeneratorContainer';

export default function HomePage() {
	return (
		<ItemGeneratorContainer>
			<div id="itens_dropped" className="drops"></div>
		</ItemGeneratorContainer>
	);
}
