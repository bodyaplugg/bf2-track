import React from 'react'

interface ErrorProps {
    msg: string;
}

const ErrorCard = ({msg} : ErrorProps) => {
    return (<div className="p-error">{msg}</div>)
}

export default ErrorCard