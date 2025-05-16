import React, { useState } from 'react'
import styled, { keyframes, css } from 'styled-components'
import DiceTwentyFaces from '../DiceTwentyFaces';
import { LoadingScreen } from '../LoadingScreen';

const createSpin = (clockwise: boolean) => keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(${clockwise ? '' : '-'}360deg); }
`

const DiceWrapper = styled.div.withConfig({
    shouldForwardProp: (prop) => !['animating', 'duration', 'clockwise'].includes(prop),
}) <{ animating: boolean; duration: number; clockwise: boolean }>`
  display: inline-block;
  font-size: 4rem;
  padding: 1rem;
  opacity: ${({ animating }) => (animating ? 0.6 : 1)};
  filter: blur(${({ animating }) => (animating ? "2px" : "0")});
  
  ${({ animating, duration, clockwise }) =>
        animating &&
        css`animation: ${createSpin(clockwise)} ${duration}s linear infinite;`}
`

const Button = styled.button<{ disabled?: boolean }>`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: ${({ disabled }) => (disabled ? '#555' : '#6e3fae')};
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-weight: bold;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ disabled }) => (disabled ? '#555' : '#444')};
  }
`

const ResultText = styled.div`
  margin-top: 1rem;
  font-size: 2rem;
  color: #fff;
`

type SpinningDiceProps = {
    sides?: number
    onRoll?: (value: number) => void
}

export const SpinningDice: React.FC<SpinningDiceProps> = ({
    sides = 6,
    onRoll
}) => {
    const [value, setValue] = useState(1)
    const [animating, setAnimating] = useState(false)
    const [duration, setDuration] = useState(1)
    const [clockwise, setClockwise] = useState(true)

    const roll = () => {
        const newDuration = Math.random() * 0.5 + 0.5
        const newClockwise = Math.random() > 0.5
        const newValue = Math.ceil(Math.random() * sides)

        setAnimating(true)
        setValue(0)
        setDuration(newDuration)
        setClockwise(newClockwise)

        setTimeout(() => {
            setAnimating(false)
            setValue(newValue)
            onRoll?.(newValue)
        }, newDuration * 1000)
    }

    return (
        <div>
            <div style={{ textAlign: 'center' }}>
                <DiceWrapper
                    animating={animating}
                    duration={duration}
                    clockwise={clockwise}
                >
                    <DiceTwentyFaces size={5} />
                </DiceWrapper>
                <ResultText>
                    <strong>{value > 0 ? value : "..."}</strong>
                </ResultText>
            </div>
            <Button onClick={roll} disabled={animating}>
                {animating ? 'Rolando...' : 'Rolar Dado'}
            </Button>
        </div>
    )
}
