addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  let actualUrlStr = url.pathname.replace("/proxy/", "");
  actualUrlStr = decodeURIComponent(actualUrlStr);  // Decode the URI component
  
  // Copy headers from the original request, but remove any CF headers
  let newHeaders = new Headers();
  for (let pair of request.headers.entries()) {
    if (!pair[0].startsWith('cf-')) {
      newHeaders.append(pair[0], pair[1]);
    }
  }

  const modifiedRequest = new Request(actualUrlStr, {
    headers: newHeaders,
    method: request.method,
    body: request.body,
    redirect: 'manual'
  });

  const response = await fetch(modifiedRequest);
  let modifiedResponse;
  let body = response.body;

  // Handle redirects
  if ([301, 302, 303, 307, 308].includes(response.status)) {
    const location = new URL(response.headers.get('location'));
    const modifiedLocation = "/proxy/" + encodeURIComponent(location.toString());
    modifiedResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText
    });
    modifiedResponse.headers.set('Location', modifiedLocation);
  } else {
    if (response.headers.get("Content-Type") && response.headers.get("Content-Type").includes("text/html")) {
      const originalText = await response.text();
      const regex = new RegExp('((href|src|action)=["\'])/(?!/)', 'g');
      const modifiedText = originalText.replace(regex, `$1${url.protocol}//${url.host}/proxy/${encodeURIComponent(new URL(actualUrlStr).origin + "/")}`);
      body = modifiedText;
    }

    modifiedResponse = new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    });
  }

  // Add CORS headers
  modifiedResponse.headers.set('Access-Control-Allow-Origin', '*');
  modifiedResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  modifiedResponse.headers.set('Access-Control-Allow-Headers', '*');

  return modifiedResponse;
}
