'use client';

import styled from 'styled-components';

const Card = styled.div`
  background-color: #262626;
  border: 1px solid #444;
  border-radius: 10px;
  padding: 16px;
  margin: 12px 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  color: #fff;
  text-align: left;
`;

interface ItemCardProps {
    title: string;
    description: string;
    value: string;
}

export default function ItemCard({ title, description, value }: ItemCardProps) {
    return (
        <Card>
            <h3>{title}</h3>
            <p>{description}</p>
            <strong>{value}</strong>
        </Card>
    );
}
