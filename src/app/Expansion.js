
export default function Expansion({open}) {

    return (
        <>
            <div className="subenfriamiento2"></div>
            <div className="vExpansion">
                <div className="triangulo"></div>
                <div className={open ? "trianguloReg on" : "trianguloReg"}></div>
                <div className="trianguloInv"></div>
            </div>
            <div className="expansion apagado"></div>
        </>
    )
}

