const SdkSetup = ({ ingestionKey }) => {
  const endpoint = `${import.meta.env.VITE_API_URL}/events`;

const snippet = `import {
  init,
  startErrorListener,
  sendReport,
} from './lib/whydiditbreak.js';

init({
  ingestionKey: ${JSON.stringify(ingestionKey || 'YOUR_PROJECT_KEY')},
  endpoint: ${JSON.stringify(endpoint)},
  environment: 'development',
  captureStack: false,
  captureUrl: false,
  captureBrowser: false,
});

startErrorListener(async function (report) {
  await sendReport(report);
});`;

  return (
    <section className="mt-8 space-y-3">
      <h2 className="font-semibold">Connect your application</h2>

      <ol className="list-inside list-decimal space-y-2">
        <li>
          Copy the SDK file into your application as
          {' '}<code>src/lib/whydiditbreak.js</code>.
        </li>
        <li>
          Add the code below to your browser entry file, such as
          {' '}<code>src/main.jsx</code>.
        </li>
        <li>
          Show your ingestion key above to include it in the example.
        </li>
      </ol>

      <pre className="overflow-x-auto rounded border p-4">
        <code>{snippet}</code>
      </pre>

      <p>
        Stack, URL and browser collection are optional and disabled
        in this example.
      </p>

      <p>
        Error ingestion is not implemented yet. Reports can be captured,
        but successful delivery and storage require FR-05.
      </p>
    </section>
  );
};

export default SdkSetup;