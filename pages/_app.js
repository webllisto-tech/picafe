import "../styles/globals.css";
import Layout from "../containers/Layout";
import "../styles/style.css";
import "../charts/ChartjsConfig";
function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
