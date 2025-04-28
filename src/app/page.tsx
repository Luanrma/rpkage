'use client';

import Aside from '@/app/components/Aside';
import ItemGeneratorContainer from '@/app/components/ItemGeneratorContainer';
import DamageCalculatorContainer from '@/app/components/DamageCalculatorContainer';
import InventoryContainer from './components/InventoryContainer';
import styled from "styled-components";
import { useState } from 'react';
import Users from './components/Users';

const HomePageStyle = styled.div`
	display: flex;
	padding: 0.8rem;
`;

export default function HomePage() {
	const [section, setSection] = useState<string>("Item Generator");

	const changeSection = (value: string) => {
		setSection(value);
	};

	return (
		<HomePageStyle>
			<Aside changeSection={ (value: string) => changeSection(value) } />
			{ section === "Item Generator"    && <ItemGeneratorContainer /> }
			{ section === "Damage Calculator" && <DamageCalculatorContainer /> }
			{ section === "Inventory" && <InventoryContainer /> }
			{ section === "Users" && <Users /> }
		</HomePageStyle>
	);
}
