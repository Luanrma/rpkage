import { ButtonHTMLAttributes } from "react";
import styled from "styled-components";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    $backgroundColor?: string;
    $textColor?: string;
};

export const Button = styled.button<ButtonProps>`
  padding: 1rem 1rem;
  margin: 0.3rem;
  background: ${props => props.$backgroundColor ?? '#3b82f6'};
  border: none;
  border-radius: 8px;
  color: ${props => props.$textColor ?? '#fff'};
  font-size: 1rem;
  cursor: pointer;
  transition: 0.3s;
`;
