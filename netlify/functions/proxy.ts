// netlify/edge-functions/proxy.ts
export default async (request: Request) => {
  const url = new URL(request.url);

  // 从环境变量获取目标 URL，默认值为 http://129.146.244.132:8085
  const TARGET_URL = process.env.TARGET_URL || 'http://129.146.244.132:8085';
  console.log(`反代目标地址: ${TARGET_URL}`);

  if (url.pathname.startsWith('/xblog')) {
    try {
      const targetUrl = `${TARGET_URL}${url.pathname}`;
      console.log(`转发请求到: ${targetUrl}`);

      const response = await fetch(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        duplex: 'half',
      });

      return new Response(response.body, {
        status: response.status,
        headers: {
          ...Object.fromEntries(response.headers),
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (error) {
      console.error('转发失败:', error);
      return new Response('Proxy Error', { status: 502 });
    }
  }

  return new Response('Not Found', { status: 404 });
};
