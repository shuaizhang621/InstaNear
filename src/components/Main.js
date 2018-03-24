import React from 'react';
import { WrappedRegister } from './Register';
import { Login } from './Login';

export class Main extends React.Component {
    render() {
        return (
            <section className="main">
                <Login/>
            </section>
        )
    }
}