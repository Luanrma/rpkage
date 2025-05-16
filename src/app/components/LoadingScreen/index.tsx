import { GiDiceTwentyFacesTwenty } from 'react-icons/gi'
import styled, { keyframes } from 'styled-components'

type LoadingScreenProps = {
    message?: string
}

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background-color: #0c0c0c;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const SpinningDice = styled(GiDiceTwentyFacesTwenty)`
  font-size: 150px;
  color: #ffdd57;
  animation: ${spin} 1.6s linear infinite;
  margin-bottom: 1.5rem;
`

const LoadingText = styled.p`
  font-size: 1.4rem;
  color: #e0e0e0;
  font-weight: 500;
  text-align: center;
  max-width: 90%;
`

export function LoadingScreen({ message = 'Carregando seu destino...' }: LoadingScreenProps) {
    return (
        <Overlay>
            <SpinningDice />
            <LoadingText>{message}</LoadingText>
        </Overlay>
    )
}
