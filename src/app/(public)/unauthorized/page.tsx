'use client'

import Aside from "@/app/components/Aside";
import styled from "styled-components";

const UnauthorizedDiv = styled.div`
    display: flex;
`

export default function UnauthorizedPage() {
    return (
        <>
            <UnauthorizedDiv>
                <h1>Acesso negado</h1>
                <p>Você não tem permissão para acessar esta página.</p>
            </UnauthorizedDiv>
        </>
    )
}