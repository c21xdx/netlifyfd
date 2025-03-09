export default async (request: Request) => {
  const url = new URL(request.url);

  console.log(`--- 新请求 ---`);
  console.log(`方法: ${request.method}`);
  console.log(`路径: ${url.pathname}`);
  console.log('请求头:', Object.fromEntries(request.headers));

  if (url.pathname.startsWith('/xblog')) {
    try {
      const targetUrl = `http://129.146.244.132:8085${url.pathname}`;
      console.log(`转发请求到: ${targetUrl}`);

      const clonedRequest = request.clone();
      const requestBody = await clonedRequest.text();
      console.log('请求体:', requestBody);

      const response = await fetch(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        duplex: 'half',
      });

      // 读取并记录响应体
      const responseBody = await response.clone().text();
      console.log('目标服务器响应状态:', response.status);
      console.log('目标服务器响应体:', responseBody);

      return new Response(responseBody, {
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
