import { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";

export default function BusyButton(props){
    
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        setBusy(props.busy);
    }, [props.busy]);

    return(
        <Button type={props.type} variant={props.variant} disabled={busy}>
            {busy ? <Spinner animation="border" size="sm"/> : null}
            &nbsp;
            {props.label}
        </Button>
    )
}