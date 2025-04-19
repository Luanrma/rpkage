import { ButtonHTMLAttributes } from "react";
import styled from "styled-components";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    $backgroundColor?: string;
    $textColor?: string;
};

export const Button = styled.button<ButtonProps>`
  width: 200px;
  padding: 14px 26px;
  margin: 5px;
  background: ${props => props.$backgroundColor ?? '#3b82f6'};
  border: none;
  border-radius: 8px;
  color: ${props => props.$textColor ?? '#fff'};
  font-size: 18px;
  cursor: pointer;
  transition: 0.3s;
`;
