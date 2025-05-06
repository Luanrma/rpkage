'use client'

import styled from "styled-components";

const HomePageStyle = styled.div`
	display: flex;
	padding: 0.8rem;
	justify-content: center;
	align-items: center;
	flex-direction: column;
`;

export default function HomePage() {
	return (
		<HomePageStyle>
			<h1>Home</h1>
		</HomePageStyle>
	);
}
