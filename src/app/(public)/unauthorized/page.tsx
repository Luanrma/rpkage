import Aside from "@/app/components/Aside";

export default function UnauthorizedPage() {
    return (
        <>
        <Aside/>
        <div style={{ padding: 40 }}>
            <h1>Acesso negado</h1>
            <p>Você não tem permissão para acessar esta página.</p>
        </div>
        </>
    )
}