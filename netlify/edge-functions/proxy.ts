// netlify/edge-functions/proxy.ts
export default async (request: Request) => {
  const url = new URL(request.url);

  // 处理 GET 请求
  if (request.method === 'GET') {
    return new Response('Hello World', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  // 处理 POST 请求
  if (request.method === 'POST') {
    try {
      // 转发请求到目标服务器
      const targetUrl = 'http://129.146.244.132:8085/xblog';
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: request.headers,
        body: request.body,
      });

      // 将目标服务器的响应返回给客户端
      return new Response(response.body, {
        status: response.status,
        headers: response.headers,
      });
    } catch (error) {
      return new Response('Proxy Error', { status: 502 });
    }
  }

  // 其他方法返回 405
  return new Response('Method Not Allowed', { status: 405 });
};
