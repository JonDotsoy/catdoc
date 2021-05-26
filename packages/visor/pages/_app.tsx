import { AppProps } from 'next/app';
import { FC } from 'react';
import 'antd/dist/antd.css';

export const App: FC<AppProps> = ({ Component, pageProps, children }) => {
    return <Component {...pageProps}></Component>
}

export default App;
